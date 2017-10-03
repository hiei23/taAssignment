// rust imports

use std::ffi::OsStr;
use std::fs::{self, File};
use std::panic::{self, AssertUnwindSafe};
use std::path::Path;

// 3rd-party imports

use hyper;
use hyper::server::{Service, Response};
use hyper::{Get, Post, StatusCode};
use hyper::mime::{Mime, TopLevel, SubLevel};
use hyper::header::ContentType;

use futures;
use futures::future::BoxFuture;
use futures::Future;

use serde_json;

use url::percent_encoding::percent_decode;

// local imports

use reducer::{AppResponse, AppError};
use router::JSONError;
use components::render_component;

// structs

pub struct Renderer;

impl Service for Renderer {
    type Request = AppResponse;
    type Response = Response;
    type Error = hyper::Error;
    type Future = BoxFuture<Self::Response, Self::Error>;

    fn call(&self, state: Self::Request) -> Self::Future {

        let response = match state {
            AppResponse::Component(component) => {

                match render_component(component) {
                    Ok(rendered) => {
                        Response::new()
                        // .with_header(ContentLength(INDEX.len() as u64))
                        .with_body(rendered)
                    }
                    Err(_) => {
                        Response::new()
                            .with_status(StatusCode::InternalServerError)
                            .with_body("Template render error")
                    }
                }


            }

            AppResponse::JSONResponse(json_response) => {

                let json_response_string = serde_json::to_string(&json_response).unwrap();

                Response::new()
                    .with_header(hyper::header::ContentType(mime!(Application / Json)))
                    .with_body(json_response_string)
            }

            AppResponse::Asset(content_type, content) => {
                Response::new()
                    .with_header(content_type)
                    .with_body(content)
            }

            AppResponse::AppError(app_error) => {
                match app_error {

                    AppError::JSONError(json_error) => {
                        match json_error {
                            JSONError::BadRequest(reason) => {
                                Response::new()
                                    .with_status(StatusCode::BadRequest)
                                    .with_body(reason.unwrap_or("Bad Request".into()))
                            }
                        }
                    }
                    AppError::NotFound => {
                        Response::new()
                            .with_status(StatusCode::NotFound)
                            .with_body("404 Not Found")
                    }
                    AppError::MethodNotAllowed => {
                        Response::new()
                            .with_status(StatusCode::MethodNotAllowed)
                            .with_body("405 Method Not Allowed")
                    }
                }
            }
        };

        futures::future::ok(response).boxed()

        // TODO: remove

        // TODO: template rendering using AppState

        // let r = Response::new().with_status(StatusCode::NotFound);
        // futures::future::ok(r).boxed()

        // futures::future::err(hyper::Error::Method).boxed()

    }
}

// fn fetch_assets(path: String) -> Response {

//     // Security barrier to contain stuff
//     let result = panic::catch_unwind(AssertUnwindSafe(|| __fetch_assets(path)));

//     match result {
//         Err(why) => {
//             // TODO: internal error logging

//             let reason: String = if let Some(why) = why.downcast_ref::<String>() {
//                 format!("{}", why)
//             } else if let Some(why) = why.downcast_ref::<&str>() {
//                 format!("{}", why)
//             } else {
//                 format!("{:?}", why)
//             };

//             println!("PANIC REASON: {}", reason);

//             Response::Component(AppRoute::InternalServerError)

//         }
//         Ok(result) => result,
//     }

// }
