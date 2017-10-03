// 3rd-party imports

use chrono::naive::datetime::NaiveDateTime;

use reducer::Course;

use chrono;

// structs & enums

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Program {
    UG,
    MSC,
    MSAC,
    PHD,
}

#[derive(Serialize, Clone)]
pub struct Applicant {
    givenname: String,
    familyname: String,
    studentnumber: u64,
    program: Program,
    year: u64,
    tacourses: Vec<Course>,
    courses: Vec<Course>,
    phonenumber: String,
    emailaddress: String,
    // (legally allowed to work in Canada)
    workstatus: bool,
    workstatusexplain: String,
    studentdepartment: String,
    studentdepartmentexplain: String,
    dateofapplication: NaiveDateTime,
}

#[derive(Deserialize)]
pub struct CreateApplicant {
    givenname: String,
    familyname: String,
    studentnumber: u64,
    program: Program,
    year: u64,
    tacourses: Vec<Course>,
    courses: Vec<Course>,
    phonenumber: String,
    emailaddress: String,
    // (legally allowed to work in Canada)
    workstatus: bool,
    workstatusexplain: String,
    studentdepartment: String,
    studentdepartmentexplain: String,
}

impl CreateApplicant {
    pub fn transform(self) -> Applicant {
        Applicant {
            givenname: self.givenname,
            familyname: self.familyname,
            studentnumber: self.studentnumber,
            program: self.program,
            year: self.year,
            tacourses: self.tacourses,
            courses: self.courses,
            phonenumber: self.phonenumber,
            emailaddress: self.emailaddress,
            // (legally allowed to work in Canada)
            workstatus: self.workstatus,
            workstatusexplain: self.workstatusexplain,
            studentdepartment: self.studentdepartment,
            studentdepartmentexplain: self.studentdepartmentexplain,
            dateofapplication: chrono::offset::utc::UTC::now().naive_utc(),
        }
    }
}
