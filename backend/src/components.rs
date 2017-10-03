// 3rd-party imports

use horrorshow::{TemplateBuffer, Template, Raw, FnRenderer};
use horrorshow::helper::doctype;
use horrorshow::Error as TemplateError;

// local imports

use reducer::Component;

// functions

pub fn render_component(component: Component) -> Result<String, TemplateError> {
    FnRenderer::new(|tmpl| {
            app_component(tmpl);
        })
        .into_string()
}

fn app_component(tmpl: &mut TemplateBuffer) {

    tmpl <<
    html! {
        : doctype::HTML;
        html(lang="en") {
            |tmpl| {
                head(tmpl)
            }
            |tmpl| {
                body(tmpl)
            }
        }
    }
}

fn head(tmpl: &mut TemplateBuffer) {

    fn generate_title() -> String {
        // TODO: complete
        format!("CSC302 - Ship It Party Parrots")
    }


    tmpl <<
    html!{
        head {

            meta(charset="UTF-8");

            link (
                rel="stylesheet",
                href="/css/main.css"
            );

            link(rel="icon", href="/assets/favicon.ico", type="image/x-icon");

            title {
                : generate_title()
            }
        }
    }
}

fn body(tmpl: &mut TemplateBuffer) {
    tmpl <<
    html! {
        body {
            div(id="ta-coord-nav-bar") {}
            div(id="ta-coord-body") {}

            |tmpl| {
                js_includes(tmpl);
            }
        }
    }
}

fn js_includes(tmpl: &mut TemplateBuffer) {
    tmpl <<
    html! {
        script(type="text/javascript", src="/js/commons.js") {}
        script(type="text/javascript", src="/js/ta_coord.js") {}
        script(type="text/javascript", src="/js/nav_bar.js") {}
        // script(type="text/javascript", src="/assets/login.js") {}
    }
}
