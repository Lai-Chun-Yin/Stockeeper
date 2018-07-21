function isEmail(email) {
    return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);
}

$('#signup-form').on("submit", function (e) {
    if(!$("input[name='password']").val()){
        e.preventDefault();
        alert("Please set up a password.");
    }
    if ($("input[name='password']").val() !== $("input[name='retype-password']").val()) {
        e.preventDefault();
        alert("Entered password does not match with re-type.");
    }
    if($("input[name='password']").hasClass("invalid")){
        e.preventDefault();
        alert("Entered email is not valid.");
    }
});

$("input[name='username']").on('change', function () {

    let email = $(event.target).val();
    if (isEmail(email)) {
        let encodedEmail = encodeURI(email);
        let query = `/api/user?email=${encodedEmail}`;
        axios.get(query).then((response) => {
            console.log(response.data.check);
            if (response.data.check === "pass") {
                $("input[name='username']").removeClass("invalid").addClass("valid");
            }else{
                $("input[name='username']").removeClass("valid").addClass("invalid");
            }
        });
        // if (checkRegistry(email)) {
        //     return $(event.target).removeClass("invalid").addClass("valid");
        // }
    } else {
    $(event.target).removeClass("valid").addClass("invalid");}
});
// let validated = false;
// function validateEmail(val) {
//     checkRegistry(val);
//     return validated;
// }

function checkRegistry(email) {

    let encodedEmail = encodeURI(email);
    let query = `/api/user?email=${encodedEmail}`;
    axios.get(query).then((response) => {
        if (response.data.check === "pass") {
            return true;
        }
    });

}