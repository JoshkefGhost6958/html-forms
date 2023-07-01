let register_form = document.getElementById('register-form');
let login_form = document.getElementById('login-form');
let login_trigger = document.getElementById('login-trigger');
let register_trigger = document.getElementById('register-trigger');

const patterns = {
  name_reg: /^[^\t][a-z]{1,20}$/mi,
  phone_reg: /^\d{10,12}$/mi,
  email_reg:/^\w{1,64}@[^\t][a-z]{1,}\.[a-z]{1,8}\.*[a-z]{1,2}$/mi,
  pass_reg: /^[\w@\$!*#&§%]{8,20}$/mi
}

function validate(field,regex){
  const parse_regex = new RegExp(regex);
  if(parse_regex.test(field)){
    return true
  }
}
async function create_user(username,password,email,phone){
  try {
    let password_b = document.getElementById('password-b');
    let valid_password = (password == password_b)
    if(!validate(username,patterns.name_reg)){
      message = document.getElementById('user-message');
      message.style.color = 'red';
      message.innerHTML = 'max of 20 characters needed';
    }else{
      message = document.getElementById('user-message');
      message.style.color = 'green';
      message.innerHTML = 'username is valid'
    }
    if(!validate(email,patterns.email_reg)){
      message = document.getElementById('user-email-message');
      message.style.color = 'red';
      message.innerHTML = 'invalid email adress';
    }else{
      message = document.getElementById('user-email-message');
      message.style.color = 'green';
      message.innerHTML = 'valid email'
    }
    if(!validate(phone,patterns.phone_reg)){
      message = document.getElementById('user-phone-message');
      message.style.color = 'red';
      message.innerHTML = 'Invalid phone number';
    }else{
      message = document.getElementById('user-phone-message');
      message.style.color = 'green';
      message.innerHTML = 'valid phone number';
    }
    if(!validate(password,patterns.pass_reg)){
      message = document.getElementById('user-password-message');
      message.style.color = 'red';
      message.innerHTML = 'weak password';
    }else{
      if(!valid_password){
        message = document.getElementById('user-password-message');
        message.style.color = 'red';
        message.innerHTML = 'passwords do not match';
      }
      message = document.getElementById('user-password-message');
      message.style.color = 'green';
      message.innerHTML = 'Strong password'; 
    }

    body = {
      username:username,
      password:password,
      email:email,
      phone:phone
    }
    const response = await fetch(
      'http://localhost:8000/createuser',
      {
        method:'POST',
        headers:{
          Accept:'application.json',
          'Access-Control-Allow-Origin':'*',
          'Content-Type':'application/json'},
        body:JSON.stringify(body)
    }
    ).then(response=>response.json())
  } catch (error) {
    console.error(error)
  }  
}

register_form.addEventListener("submit",
  (e)=>{
    e.preventDefault();
    let username = document.getElementById('username');
    let email = document.getElementById('email');
    let password = document.getElementById('password-a');
    let phone = document.getElementById('phone')

    if (username.value == "" || password.value == "" || email.value == "" || phone.value == ""){
      alert("fill in both fields before submitting")
    }
    user = create_user(username.value,password.value,email.value,phone.value)
  }
)

login_form.addEventListener("submit",
  async(e)=>{
    e.preventDefault()
    let username = document.getElementById('username-login')
    let password = document.getElementById('password-login')
    user_data = {
      username:username.value,
      password:password.value
    }
    let token_data = await fetch(
      'http://localhost:8000/login',
      {
        method:'POST',
        headers:{
          Accept:'application.json',
          'Access-Control-Allow-Origin':'*',
          'Content-Type':'application/json'
        },
        body:JSON.stringify(user_data)
      }
    );
    let data = await token_data.json();
    const exp_date = new Date();
    exp_date.setTime(exp_date.getTime() + (30 * 60*1000 ));
    document.cookie = `${user_data.username}=${data.token}; expires=${exp_date.toUTCString()};SameSite=Lax`;
  }
)

async function view_restricted_pages(username,route){
  var match = document.cookie.match(new RegExp('(^| )' + username + '=([^;]+)'));
  (match)?(console.log(match[2])) : (console.error("something went wrong"));
  let user_request = fetch(
    `http://localhost:8000/${route}`,
  )
}
login_trigger.addEventListener("click",
  (e)=>{
    e.preventDefault()
    register_form.style.display = 'none';
    login_form.style.display = 'block';
  }
)

register_trigger.addEventListener("click",

  (e)=>{
    e.preventDefault()
    login_form.style.display = 'none';
    register_form.style.display = 'block';
  }
)