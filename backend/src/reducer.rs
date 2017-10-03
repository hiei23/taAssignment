// rust imports

use std::ffi::OsStr;
use std::path::{PathBuf, Path};
use std::fs::{self, File};
use std::io::Read;
use std::sync::{Arc, Mutex};
use std::collections::HashMap;


// 3rd-party imports

use hyper;
use hyper::server::Service;
use hyper::header::ContentType;
use hyper::mime::{Mime, TopLevel, SubLevel};

use futures;
use futures::future::BoxFuture;
use futures::Future;
use futures::future::FutureResult;

use serde::ser::Serialize;
use serde_json;

use url::percent_encoding::percent_decode;

use mime_types;

// local imports

use router::{Route, RouteError, APIRoute, JSONError, ApplicantsRoute};
use applicants::Applicant;

// statics

lazy_static! {
    static ref MIME_TYPES: mime_types::Types = mime_types::Types::new().unwrap();

    // TODO: internationalization for these strings below
    // static ref INTERNAL_SERVER_ERROR_STRING: String = "An internal server error occurred.".to_string();

    // NOTE: This is for API responses
    // static ref API_METHOD_NOT_ALLOWED_STRING: String =
    //     "An invalid request was sent. (ERROR: Method not allowed)".to_string();

    static ref GLOBAL_APP_STATE: Arc<Mutex<GlobalAppState>> = {

        let mut global_app_state = GlobalAppState::new();

        {
            global_app_state.users.insert(Username("joe".into()), Password("pass".into()));
        };

        {
            let courses: Vec<Courses> = vec![

                Courses {
                    level: Level(100),
                    courses: vec![
                        Course("CSC104".into()),
                        Course("CSC108".into()),
                        Course("CSC140".into()),
                    ]
                },

                Courses {
                    level: Level(200),
                    courses: vec![
                    Course("CSC200".into()),
                    Course("CSC202".into()),
                    Course("CSC236".into()),
                    Course("CSC263".into()),
                ]},

                Courses {
                    level: Level(300),
                    courses: vec![
                    Course("CSC300".into()),
                    Course("CSC301".into()),
                    Course("CSC302".into()),
                    Course("CSC343".into()),
                    Course("CSC369".into()),
                ]},

                Courses {
                    level: Level(400),
                    courses: vec![
                    Course("CSC404".into()),
                    Course("CSC409".into()),
                    Course("CSC443".into()),
                    Course("CSC458".into()),
                    Course("CSC469".into()),
                    Course("CSC473".into()),
                ]},
            ];

            global_app_state.courses = courses;
        };

        Arc::new(Mutex::new(global_app_state))
    };
}

// structs

#[derive(Deserialize, Serialize, Clone)]
pub struct Course(String);
#[derive(Serialize)]
pub struct Level(u64);

#[derive(Serialize)]
struct Courses {
    level: Level,
    courses: Vec<Course>,
}

#[derive(Serialize, Hash, Eq, PartialEq, Deserialize)]
pub struct Username(String);

#[derive(Serialize, PartialEq, Eq, Deserialize)]
pub struct Password(String);

#[derive(Serialize)]
struct GlobalAppState {
    courses: Vec<Courses>,
    users: HashMap<Username, Password>,
    applicants: Vec<Applicant>,
}

impl GlobalAppState {
    fn new() -> Self {
        GlobalAppState {
            courses: vec![],
            users: HashMap::new(),
            applicants: vec![],
        }
    }
}

// TODO: polish
#[derive(Serialize, Debug)]
pub struct JSONResponse {
    pub error: Option<String>,
    pub payload: Option<serde_json::Value>,
}

impl JSONResponse {
    fn error(reason: Option<String>) -> Self {
        JSONResponse {
            error: reason,
            payload: None,
        }
    }

    fn payload<T: Serialize>(value: T) -> Self {
        use serde_json::to_value;
        JSONResponse {
            error: None,
            payload: Some(to_value(value).unwrap()),
        }
    }
}

pub enum AppResponse {
    Component(Component),
    JSONResponse(JSONResponse),
    AppError(AppError),
    Asset(ContentType, Vec<u8> /* content */),
}

pub enum AppError {
    JSONError(JSONError),
    NotFound,
    MethodNotAllowed,
}

// TODO: move this somewhere
pub enum Component {
    Home,
}

pub struct Reducer;

impl Service for Reducer {
    type Request = Route;
    type Response = AppResponse;
    type Error = hyper::Error;
    type Future = BoxFuture<Self::Response, Self::Error>;

    fn call(&self, req: Self::Request) -> Self::Future {
        fetch_app_state(req).boxed()
    }
}

fn fetch_app_state<E>(route: Route) -> FutureResult<AppResponse, E> {

    // TODO: note: this is where all db calls are performed

    let app_state = match route {

        Route::Home => AppResponse::Component(Component::Home),

        Route::API(api_route) => {
            match api_route {

                APIRoute::Applicants(applicants_route) => {
                    match applicants_route {

                        ApplicantsRoute::GetAll => {

                            let global_app_state = GLOBAL_APP_STATE.clone();

                            let guard = global_app_state.lock().unwrap();

                            let json_response = JSONResponse::payload(guard.applicants.clone());

                            AppResponse::JSONResponse(json_response)

                        }
                        ApplicantsRoute::Create(applicant) => {

                            let global_app_state = GLOBAL_APP_STATE.clone();

                            let mut guard = global_app_state.lock().unwrap();

                            let applicant = applicant.transform();

                            guard.applicants.push(applicant.clone());

                            let json_response = JSONResponse::payload(applicant);

                            AppResponse::JSONResponse(json_response)

                        }
                    }
                }

                APIRoute::Login(login) => {

                    let global_app_state = GLOBAL_APP_STATE.clone();

                    let guard = global_app_state.lock().unwrap();

                    let ref users = guard.users;

                    let is_valid = match users.get(&login.username) {
                        Some(password) => password == &login.password,
                        None => false,
                    };

                    let json_response = JSONResponse::payload(is_valid);

                    AppResponse::JSONResponse(json_response)
                }

                APIRoute::Courses => {

                    let global_app_state = GLOBAL_APP_STATE.clone();

                    let guard = global_app_state.lock().unwrap();

                    let ref courses = guard.courses;

                    let json_response = JSONResponse::payload(courses);

                    AppResponse::JSONResponse(json_response)
                }
            }
        }

        Route::Asset(path) => fetch_assets(path),

        Route::RouteError(route_error) => {
            let app_err = match route_error {
                RouteError::JSONError(json_error) => {

                    AppError::JSONError(json_error)
                    // let json_response = JSONResponse::err(courses);

                    // AppResponse::JSONErrResponse(json_response)
                }
                RouteError::NotFound => AppError::NotFound,
                RouteError::MethodNotAllowed => AppError::MethodNotAllowed,
            };

            AppResponse::AppError(app_err)
        }
    };

    futures::future::ok(app_state)
}


#[inline]
fn fetch_assets(path: String) -> AppResponse {

    #[inline]
    fn decode_percents(string: &OsStr) -> String {
        let string = format!("{}", string.to_string_lossy());
        format!("{}", percent_decode(string.as_bytes()).decode_utf8_lossy())
    }

    // TODO: inlined resources here

    // URL decode
    let decoded_req_path = Path::new(&path).iter().map(decode_percents);

    let starts_with = match Path::new("./src/assets/").to_path_buf().canonicalize() {
        Err(_) => {
            return AppResponse::AppError(AppError::NotFound);
        }
        Ok(x) => x,
    };

    let mut req_path = starts_with.clone();
    req_path.extend(decoded_req_path);
    let req_path: PathBuf = req_path;

    // TODO: this is a security bottle-neck
    let req_path = match req_path.canonicalize() {
        Err(_) => {
            return AppResponse::AppError(AppError::NotFound);
        }
        Ok(req_path) => {

            if !req_path.starts_with(starts_with.as_path()) {
                return AppResponse::AppError(AppError::NotFound);
            }

            req_path
        }
    };


    match fs::metadata(&req_path) {
        Ok(metadata) => {

            if !metadata.is_file() {
                return AppResponse::AppError(AppError::NotFound);
            }

            // TODO: better way?
            let path_str = format!("{}", &req_path.to_string_lossy());

            // println!("req_path.as_path() = {:?}", req_path.as_path().clone());

            // Set the content type based on the file extension
            let mime_str = MIME_TYPES.mime_for_path(req_path.as_path());

            let mut content_type = ContentType(Mime(TopLevel::Application, SubLevel::Json, vec![]));

            let _ = mime_str.parse().map(|mime: Mime| {
                content_type = ContentType(mime);
            });

            let mut file = File::open(req_path)
                .ok()
                .expect(&format!("No such file: {:?}", path_str));

            let mut content = Vec::new();

            file.read_to_end(&mut content).unwrap();

            return AppResponse::Asset(content_type, content);

        }
        Err(_err) => {
            return AppResponse::AppError(AppError::NotFound);
        }
    }

}
