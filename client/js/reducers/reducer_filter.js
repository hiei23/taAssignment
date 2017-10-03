export default function () {
    return [
        {
            type: "Department",
            options: [
                {name: "CSC", value: "CSC"}, {name: "ECE", value: "ECE"}, {name: "Others", value: "Others"}
            ]
        },
        {
            type: "Education Level",
            options: [
                {name: "Undergraduate", value: "U"},
                {name: "Graduate", value: "G"}
            ]
        },
        {
            type: "Others",
            options: [
                {name: "Hide Unexperienced", value: "Unexperienced"},
                {name: "Hide Assigned TAs", value: "Assigned"}
            ]
        }
    ];
}