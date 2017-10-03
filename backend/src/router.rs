// rust imports

// use std::cell::RefCell;
// use std::rc::Rc;

// 3rd-party imports

use hyper;
use hyper::server::{Service, Request};
use hyper::{Method, Body};

// use futures;
use futures::future::BoxFuture;
use futures::Future;
use futures::Stream;

use chomp::parsers::{SimpleResult, token, eof};
use chomp::combinators::{option, or};
use chomp::types::U8Input;
use chomp::parse_only;

use serde_json;

// local imports

use parsers::{parse_byte_limit, parse_query_string, QueryString, string_till, string_ignore_case};
use reducer::{Username, Password};
use applicants::{Applicant, CreateApplicant};

// structs & structs

struct BodyContent;

impl BodyContent {
    fn from_body(body: Body) -> BoxFuture<String, hyper::Error> {
        let body = body.fold(vec![], |mut acc, chunk| -> Result<Vec<u8>, hyper::Error> {
                acc.extend_from_slice(&chunk);
                Ok(acc)
            })
            .map_err(|x: hyper::Error| x)
            .map(|v| String::from_utf8(v).unwrap())
            .boxed();

        body
        // body.wait().unwrap()
    }
}

#[derive(Deserialize)]
pub struct Login {
    pub username: Username,
    pub password: Password,
}

pub enum Route {
    Home,
    API(APIRoute),
    // TODO: what is this?
    // Backdoor,
    RouteError(RouteError),
    Asset(String /* path */),
}

pub enum APIRoute {
    Courses,
    Login(Login),
    Applicants(ApplicantsRoute),
}

pub enum ApplicantsRoute {
    GetAll,
    Create(CreateApplicant), /* Get(Applicant),
                              * GetAll */
}

pub enum RouteError {
    NotFound,
    MethodNotAllowed,
    JSONError(JSONError), /* InternalServerError
                           * JSONError(JSONError), */
}

pub enum JSONError {
    // MethodNotAllowed(Option<String>),
    BadRequest(Option<String>), // NotFound(Option<String>),
}

// middleware

#[derive(Clone)]
pub struct HyperRequest(hyper::Method, hyper::Uri, hyper::HttpVersion, hyper::Headers, String);

impl HyperRequest {
    fn new(req: Request) -> BoxFuture<HyperRequest, hyper::Error> {
        let (method, uri, http_version, headers, body) = req.deconstruct();

        BodyContent::from_body(body)
            .map(move |body| {

                let request = HyperRequest(method, uri, http_version, headers, body.clone());

                request
            })
            .boxed()
    }

    fn method(&self) -> hyper::Method {
        self.0.clone()
    }

    fn body(&self) -> String {
        self.4.clone()
    }

    fn uri(&self) -> String {
        format!("{}", self.1)
    }
}

pub struct Router;

impl Service for Router {
    type Request = Request;
    type Response = Route;
    type Error = hyper::Error;
    type Future = BoxFuture<Self::Response, Self::Error>;

    fn call(&self, request: Self::Request) -> Self::Future {

        HyperRequest::new(request)
            .map(|request| {

                let path = request.uri();

                let route_result = match parse_only(|i| parse_request_uri(i, request),
                                                    path.as_bytes()) {
                    Ok(route) => {
                        // route is successfully interpreted
                        route
                    }
                    Err((&_, route_err)) => {

                        // 404 error
                        // TODO: internal error logging

                        // NOTE: This is intentionally not an internal server error.

                        Route::RouteError(RouteError::NotFound)

                        // Err(route_err)
                    }
                };

                route_result

                // futures::future::ok(route_result)
            })
            .boxed()

    }
}

/* functions */

pub fn parse_request_uri<I: U8Input>(input: I, request: HyperRequest) -> SimpleResult<I, Route> {

    parse!{input;

        // path must begin with /
        // see: https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax
        parse_byte_limit(b'/', 5);

        // NOTE: order matters
        let route_result =

            // img/*, resources/*, js/*
            parse_assets(request.clone()) <|>

            // api/*
            parse_route_api(request.clone()) <|>

            // /
            parse_route_root(request.clone()) <|>

            // * (this should be last)
            not_found_route(request.clone());

        ret route_result
    }
}

fn not_found_route<I: U8Input>(input: I, request: HyperRequest) -> SimpleResult<I, Route> {
    parse!{input;
        let result = ensure_get_method(request.clone()) <|>
            (i -> i.ret(Route::RouteError(RouteError::NotFound)));

        ret result
    }
}

fn parse_route_api<I: U8Input>(input: I, request: HyperRequest) -> SimpleResult<I, Route> {
    parse!{input;

        string_ignore_case(b"api");
        parse_byte_limit(b'/', 5);

        let response = parse_route_api_course(request.clone()) <|>
            parse_route_api_login(request.clone()) <|>
            parse_route_api_applicants(request.clone());

        ret response
    }
}

fn parse_route_api_course<I: U8Input>(input: I, request: HyperRequest) -> SimpleResult<I, Route> {

    string_ignore_case(input, b"courses").then(|i| {

        if request.method() != Method::Get {
            let err = RouteError::MethodNotAllowed;
            return i.ret(Route::RouteError(err));
        }

        i.ret(Route::API(APIRoute::Courses))
    })
}

fn parse_route_api_login<I: U8Input>(input: I, request: HyperRequest) -> SimpleResult<I, Route> {

    string_ignore_case(input, b"login").then(|i| {

        if request.method() != Method::Post {
            let err = RouteError::MethodNotAllowed;
            return i.ret(Route::RouteError(err));
        }

        let content = request.body();

        let login: Login = match serde_json::from_str(&content) {
            Ok(login) => login,
            Err(_err) => {

                // TODO: internal error logging

                let reason = format!("Incorrect credentials.");
                let json_error = JSONError::BadRequest(reason.into());


                let err = RouteError::JSONError(json_error);
                return i.ret(Route::RouteError(err));
            }
        };

        i.ret(Route::API(APIRoute::Login(login)))
    })
}

fn parse_route_api_applicants<I: U8Input>(input: I,
                                          request: HyperRequest)
                                          -> SimpleResult<I, Route> {

    string_ignore_case(input, b"applicants").then(|i| {

        match request.method() {
            Method::Post => {

                let content = request.body();

                let applicant: CreateApplicant = match serde_json::from_str(&content) {
                    Ok(applicant) => applicant,
                    Err(_err) => {

                        println!("{:?}", _err);

                        // TODO: internal error logging

                        let reason = format!("Bad request.");
                        let json_error = JSONError::BadRequest(reason.into());


                        let err = RouteError::JSONError(json_error);
                        return i.ret(Route::RouteError(err));
                    }
                };

                let applicant_route = ApplicantsRoute::Create(applicant);

                i.ret(Route::API(APIRoute::Applicants(applicant_route)))
            }

            Method::Get => {

                let applicant_route = ApplicantsRoute::GetAll;

                i.ret(Route::API(APIRoute::Applicants(applicant_route)))
            }

            _ => {

                let err = RouteError::MethodNotAllowed;
                return i.ret(Route::RouteError(err));
            }
        }


    })
}

fn parse_route_root<I: U8Input>(input: I, request: HyperRequest) -> SimpleResult<I, Route> {

    #[inline]
    fn __root<I: U8Input>(input: I, request: HyperRequest) -> SimpleResult<I, Route> {
        parse_any_query_string(input).map(|_| Route::Home)
    }

    parse!{input;
        let result = ensure_get_method(request.clone()) <|> __root(request.clone());
        ret result
    }
}

fn parse_assets<I: U8Input>(input: I, request: HyperRequest) -> SimpleResult<I, Route> {

    // fn __parse_assets<I: U8Input>(input: I, request: HyperRequest) -> SimpleResult<I, Route> {
    //     (parse!{input;

    //         // string_ignore_case(b"assets");
    //         // string_ignore_case(b"/");

    //         ret {()}
    //     })
    //         .then(|i| {

    //             or(i, |i| ensure_get_method(i, request.clone()), |i| {
    //                 parse!{i;
    //                     let path = string_till(|i| or(i, |i| token(i, b'?').map(|_| ()), eof));
    //                     ret Route::Asset(path)
    //                 }
    //             })
    //         })
    // }

    fn __parse_resources<I: U8Input>(input: I, request: HyperRequest) -> SimpleResult<I, Route> {
        (parse!{input;

            string_ignore_case(b"resources");
            string_ignore_case(b"/");

        })
            .then(|i| {

                or(i, |i| ensure_get_method(i, request.clone()), |i| {
                    parse!{i;
                        let path = string_till(|i| or(i, |i| token(i, b'?').map(|_| ()), eof));
                        ret Route::Asset(format!("resources/{}", path))
                    }
                })
            })
    }

    fn __parse_js<I: U8Input>(input: I, request: HyperRequest) -> SimpleResult<I, Route> {
        (parse!{input;

            string_ignore_case(b"js");
            string_ignore_case(b"/");

        })
            .then(|i| {

                or(i, |i| ensure_get_method(i, request.clone()), |i| {
                    parse!{i;
                        let path = string_till(|i| or(i, |i| token(i, b'?').map(|_| ()), eof));
                        ret Route::Asset(format!("js/{}", path))
                    }
                })
            })
    }

    fn __parse_css<I: U8Input>(input: I, request: HyperRequest) -> SimpleResult<I, Route> {
        (parse!{input;

            string_ignore_case(b"css");
            string_ignore_case(b"/");

        })
            .then(|i| {

                or(i, |i| ensure_get_method(i, request.clone()), |i| {
                    parse!{i;
                        let path = string_till(|i| or(i, |i| token(i, b'?').map(|_| ()), eof));
                        ret Route::Asset(format!("css/{}", path))
                    }
                })
            })
    }

    fn __parse_img<I: U8Input>(input: I, request: HyperRequest) -> SimpleResult<I, Route> {
        (parse!{input;

            string_ignore_case(b"img");
            string_ignore_case(b"/");

        })
            .then(|i| {

                or(i, |i| ensure_get_method(i, request.clone()), |i| {
                    parse!{i;
                        let path = string_till(|i| or(i, |i| token(i, b'?').map(|_| ()), eof));
                        ret Route::Asset(format!("img/{}", path))
                    }
                })
            })
    }

    parse!{input;

        let result = __parse_js(request.clone()) <|>
        __parse_resources(request.clone()) <|>
        __parse_css(request.clone()) <|>
        __parse_img(request.clone());

        ret result
    }
}

fn ensure_get_method<I: U8Input>(input: I, request: HyperRequest) -> SimpleResult<I, Route> {


    // parse success when method is not GET. i.e. method not allowed route is returned;
    // otherwise, parse error.

    if request.method() != Method::Get {
        let err = RouteError::MethodNotAllowed;
        input.ret(Route::RouteError(err))
    } else {
        use chomp::parsers::Error;
        input.err(Error::unexpected())
    }
}

fn parse_any_query_string<I: U8Input>(i: I) -> SimpleResult<I, Option<QueryString>> {
    parse!{i;

        option(|i| parse_byte_limit(i, b'/', 5), ());

        let query_string = option(|i| parse!{i;
            // TODO: error logging
            let query_string = parse_query_string();

            ret Some(query_string)
        }, None);

        eof();

        ret query_string
    }
}
