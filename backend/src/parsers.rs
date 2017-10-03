// rust imports

use std::collections::HashMap;

// 3rd-party imports

use url::percent_encoding::percent_decode;

use chomp::parsers::{SimpleResult, scan, take_till, string, satisfy, take_while1, token, any};
use chomp::combinators::{option, look_ahead, many_till, skip_many, or};
use chomp::types::{Buffer, Input, ParseResult, U8Input};
use chomp::parsers::Error as ChompError;
use chomp::primitives::Primitives;

// functions

// parse to string till stop_at parser is satisfied. input satisfying stop_at wont be consumed.
#[inline]
pub fn string_till<I: U8Input, F>(input: I, mut stop_at: F) -> SimpleResult<I, String>
    where F: FnMut(I) -> SimpleResult<I, ()>
{

    many_till(input, any, |i| look_ahead(i, &mut stop_at)).bind(|i, line: Vec<u8>| {
        let string: String = String::from_utf8_lossy(line.as_slice()).into_owned();
        i.ret(string)
    })

}

// parse delim 1-time, and then optionally max_reoccurance more times.
#[inline]
pub fn parse_byte_limit<I: U8Input>(input: I,
                                    delim: u8,
                                    max_reoccurance: u8)
                                    -> SimpleResult<I, ()> {

    let mut result = parse!{input;
        token(delim);
        ret {()}
    };

    let mut idx = 0;

    let not_delim = {
        if delim == b'a' { b'b' } else { b'a' }
    };

    loop {

        if idx >= max_reoccurance {
            break;
        }

        let mut break_early = false;

        result = result.then(|i| {
            parse!{i;
                let result = option(|i| token(i, delim), not_delim);
                ret {

                    // early bail
                    if result == not_delim {
                        idx = max_reoccurance;
                    }

                    break_early = true;

                    ()
                }
            }
        });

        idx = idx + 1;

        if !break_early {
            break;
        }
    }

    return result;
}

// TODO: test
#[inline]
pub fn string_ignore_case<I: Input<Token = u8>>(mut i: I, s: &[u8]) -> SimpleResult<I, I::Buffer> {

    use std::ascii::AsciiExt;

    let mut n = 0;
    let len = s.len();

    // TODO: There has to be some more efficient way here
    let b = i.consume_while(|c| {
        if n >= len {
            false
        } else {
            let a: char = s[n] as char;
            let b: char = c as char;
            if !(a).eq_ignore_ascii_case(&b) {
                false
            } else {
                n += 1;
                true
            }
        }
    });

    if n >= len {
        i.ret(b)
    } else {
        i.err(ChompError::expected(s[n]))
    }
}

/*

Original:
E --> P {or P}
P --> leaf

Expanded:
query_string = leaf rest | leaf
rest = & leaf rest | & leaf

Cases:
?foo=42
?foo=42&bar=9000
?foo=42&&&&&
?empty

query_string :=
    skip_many(&) field_value query_string |
    skip_many(&) field_value

field_value :=
    segment(=) segment(&) |
    segment(=) segment(eof) |
    segment(&) |
    segment(&) |
    segment(eof)

*/

pub type QueryString = HashMap<String, Option<String>>;

// NOTE: this is for parsing
enum QueryStringKeyType {
    Value(String),
    NoValue(String),
}

pub fn parse_query_string<I: U8Input>(input: I) -> SimpleResult<I, QueryString> {

    // TODO: ; delimeter

    use chomp::parsers::eof;

    let mut result = parse!{input;
        token(b'?');
        skip_many(|i| token(i, b'&'));
        ret {()}
    };

    let mut should_break = false;
    let mut query_string: QueryString = HashMap::new();

    loop {

        let mut looped = false;

        result = result.then(|i| {
            parse!{i;

                let key = string_till(|i| parse!{i;
                    token(b'&') <|> token(b'=') <|> (i -> eof(i).map(|_| b'&'));
                    ret {()}
                });

                let key_type = or(
                    |i| parse!{i;
                        token(b'&');
                        skip_many(|i| token(i, b'&'));
                        ret QueryStringKeyType::NoValue(key.to_lowercase().trim().to_owned())
                    },
                    |i| or(i,
                        |i| parse!{i;
                            token(b'=');
                            ret QueryStringKeyType::Value(key.to_lowercase().trim().to_owned())
                        },
                        |i| parse!{i;
                            eof();
                            ret {
                                should_break = true;
                                QueryStringKeyType::NoValue(key.to_lowercase().trim().to_owned())
                            }
                        }
                    )
                );

                ret key_type
            }
        })
        .bind(|i, key_type| {
            match key_type {
                QueryStringKeyType::NoValue(key) => {

                    if key.len() > 0 {
                        query_string.insert(key, None);
                    }

                    looped = true;

                    i.ret(())
                }
                QueryStringKeyType::Value(key) => {
                    parse!{i;

                    let value = string_till(|i| parse!{i;
                        let res = token(b'&') <|> (i -> eof(i).map(|_| b'-'));
                        ret {
                            if res == b'-' {
                                should_break = true;
                            }
                            ()
                        }
                    });

                    token(b'&') <|> (i -> eof(i).map(|_| b'-'));
                    skip_many(|i| token(i, b'&'));

                    ret {

                        if key.len() > 0 {

                            let value: String = value;
                            let value = format!("{}", percent_decode(value.as_bytes()).decode_utf8_lossy());

                            query_string.insert(key, Some(value));
                        }

                        looped = true;

                        ()
                    }
                }
                }
            }
        });

        if should_break || !looped {
            break;
        }
    }

    return result.bind(|i, _| i.ret(query_string));
}

#[test]
fn parse_query_string_test() {

    use chomp::parse_only;

    let fails = vec!["", "&", " ", "\t"];

    for input in fails {
        match parse_only(parse_query_string, input.as_bytes()) {
            Ok(_) => assert!(false),
            Err(_) => assert!(true),
        }
    }

    let inputs = vec!["?", "?&&&"];

    for input in inputs {
        match parse_only(parse_query_string, input.as_bytes()) {
            Ok(actual) => {
                let expected: QueryString = HashMap::new();
                assert_eq!(actual, expected);
            }
            Err(_) => assert!(false),
        }
    }

    let inputs = vec!["?page=1",
                      "?page=1&&&",
                      "?page=3333&page=1",
                      "?page=3333&page=1&&&",
                      "?page=3333&&&&&page=1",
                      "?page=3333&&&&&page=1&&&",
                      "?page&page=1"];

    for input in inputs {
        match parse_only(parse_query_string, input.as_bytes()) {
            Ok(actual) => {

                let mut expected: QueryString = HashMap::new();
                expected.insert(format!("page"), Some(format!("1")));

                assert_eq!(actual, expected);
            }
            Err(_) => assert!(false),
        }
    }

    let inputs = vec!["?page=1&page&sort=desc"];

    for input in inputs {
        match parse_only(parse_query_string, input.as_bytes()) {
            Ok(actual) => {

                let mut expected: QueryString = HashMap::new();
                expected.insert(format!("page"), None);
                expected.insert(format!("sort"), Some(format!("desc")));

                assert_eq!(actual, expected);
            }
            Err(_) => assert!(false),
        }
    }

}
