// crates

extern crate futures;
extern crate hyper;
extern crate pretty_env_logger;
#[macro_use]
extern crate chomp;
extern crate url;
#[macro_use]
extern crate horrorshow;
#[macro_use]
extern crate lazy_static;
extern crate conduit_mime_types as mime_types;
#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate serde;
extern crate chrono;
#[macro_use]
extern crate mime;

// modules

mod parsers;
mod router;
mod reducer;
mod renderer;
mod components;
mod applicants;

// 3rd-party imports

use futures::future::BoxFuture;
use futures::Future;

use hyper::{Get, Post, StatusCode};
use hyper::header::ContentLength;
use hyper::server::{Http, Service, Request, Response};

// local imports

use router::Router;
use reducer::Reducer;
use renderer::Renderer;

struct Middleware;

impl Service for Middleware {
    type Request = Request;
    type Response = Response;
    type Error = hyper::Error;
    type Future = BoxFuture<Self::Response, Self::Error>;

    fn call(&self, req: Self::Request) -> Self::Future {
        Router.call(req)
            .and_then(|route| Reducer.call(route))
            .and_then(|app_state| Renderer.call(app_state))
            .boxed()
    }

    //         futures::future::ok(match (req.method(), req.path()) {
    //                 (&Get, "/") | (&Get, "/echo") => {
    //                     Response::new()
    //                         .with_header(ContentLength(INDEX.len() as u64))
    //                         .with_body(INDEX)
    //                 }
    //                 (&Post, "/echo") => {
    //                     let mut res = Response::new();
    //                     if let Some(len) = req.headers().get::<ContentLength>() {
    //                         res.headers_mut().set(len.clone());
    //                     }
    //                     res.with_body(req.body())
    //                 }
    //                 _ => Response::new().with_status(StatusCode::NotFound),
    //             })
    //             .boxed()
    //     }
}


fn main() {
    pretty_env_logger::init().unwrap();
    // let addr = "127.0.0.1:7777".parse().unwrap();
    let addr = "0.0.0.0:7777".parse().unwrap();

    let server = Http::new()
        .bind(&addr, || {
            let middleware = Middleware;
            Ok(middleware)
        })
        .unwrap();

    // TODO: cpu pooling
    println!("Listening on http://{} with 1 thread.",
             server.local_addr().unwrap());

    server.run().unwrap();
}


// TODO: remove test after it works in travis

fn foobar() -> bool {
    true
}

#[test]
fn test_foobar() {
    assert!(foobar());
}
