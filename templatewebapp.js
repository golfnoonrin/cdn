
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// LOGIN LOGOUT 
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




function checkLogIn(userNameInput,passWordInput){
  google.script.run.withSuccessHandler( (output)=>{
    // console.log(output)
    document.getElementById("login_form").reset()
    

    if ( output[0].result == "Incorrect" ){
      if ( output[0].result == "Incorrect" && output[0].detail == "Wrong_Username" ){
        loadingEnd()
        Swal.fire({ icon:'error',title:'ไม่สามารถเข้าใช้งานได้', html:"<h5 align='center'>" + output[0].detail + "</h5>"})
        // console.log("username ไม่ถูกต้อง")
        
      } else if ( output[0].result == "Incorrect" && output[0].detail == "Wrong_Password" ){
        loadingEnd()
        Swal.fire({ icon:'error',title:'ไม่สามารถเข้าใช้งานได้', html:"<h5 align='center'>" + output[0].detail + "</h5>"})
        // console.log("password ไม่ถูกต้อง")
        
      } else if ( output[0].result == "Incorrect" && output[0].detail == "Status_Pending" ){
        loadingEnd()
        Swal.fire({ icon:'error',title:'กำลังรอการอนุมัติ', html:"<h5 align='center'>" + output[0].detail + "</h5>"})
        // console.log("สถานะกำลังรอการอนุมัติ")
        
      } else if ( output[0].result == "Incorrect" && output[0].detail == "Status_Rejected" ){
        loadingEnd()
        Swal.fire({ icon:'error',title:'ไม่สามารถเข้าใช้งานได้', html:"<h5 align='center'>" + output[0].detail + "</h5>"})
        // console.log("ไม่สามารถเข้าใช้งานได้")
        
      } else if ( output[0].result == "Incorrect" && output[0].detail == "Expired_By_Date_Specific" ){
        loadingEnd()
        Swal.fire({ icon:'error',title:'ข้อมูลไม่ถูกต้อง', html:"<h5 align='center'>" + output[0].detail + "</h5>"})
        // console.log("User นี้ หมดอายุแล้ว กรุณาติดต่อ Admin")
        
      } else if ( output[0].result == "Incorrect" && output[0].detail == "Expired_By_User_Inactive" ){
        loadingEnd()
        const userInactiveEmail = output[0].email
        Swal.fire({
          icon: 'error',
          title: 'User นี้ หมดอายุแล้ว',
          html: "<h5 align='center'>เนื่องจากไม่ได้เข้าใช้งานเป็นเวลานาน</h5>   <h6 align='center'>ต้องการต่ออายุ?</h6>",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#B5D0D6',
          confirmButtonText: 'ต่ออายุ',
          cancelButtonText: 'ยกเลิก',
        }).then((result) => {
          if (result.isConfirmed) {
            // user กดเลือก ดำเนินการต่ออายุ
            loadingStart()
            sendOTPviaEmail(userInactiveEmail)
            // console.log("ต่ออายุ User")
          }
        })
      } else if ( output[0].result == "Incorrect" && output[0].detail == "Unknown_error" ){
        loadingEnd()
        Swal.fire({ icon:'error',title:'ไม่สามารถเข้าใช้งานได้', html:"<h5 align='center'>" + output[0].detail + "</h5>"})
        // console.log("Unknown_error")
      }

    } else if ( output[0].result == "Correct" ){
      if ( output[1].userLevel == "admin_p" || output[1].userLevel == "admin_a" ){
        loadingStart("สำเร็จ! กำลังเข้าสู่ระบบ")
        userInfoReturn = output[1]
        // console.log(output[1].userLevel)

        // showAdminMenu()
        showApp(userInfoReturn)
        sessionStorage.setItem("sUsername", userNameInput)
        sessionStorage.setItem("sPassword", passWordInput)
         
      } else if ( output[1].userLevel == "user_p" || output[1].userLevel == "user_a" ){
        loadingStart("สำเร็จ! กำลังเข้าสู่ระบบ")
        userInfoReturn = output[1]
        // console.log(output[1].userLevel)

        showApp(userInfoReturn)
        sessionStorage.setItem("sUsername", userNameInput)
        sessionStorage.setItem("sPassword", passWordInput)
         

      }

    }
    
    

  }).checkLogIn(userNameInput,passWordInput) 

  
};



function checkLogout(){
  sessionStorage.removeItem("sUsername"); 
  sessionStorage.removeItem("sPassword");
  sessionStorage.removeItem("sLastView")
  console.log("checkLogout")

  // console.log("log out")
  // window.open("https://imcr8.com","_self")
  // // const url = google.script.run.getScriptUrl()
  // // window.open(url,"_self")

  // google.script.run.withSuccessHandler((url)=>{
  //   window.open(url,"_self")
  // }).getScriptUrl()

  // window.history.go(-1)

};





 








// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// LOADING 
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


function loadingStart(textAlert){
  const textInAlert = textAlert != "" ? textAlert:"กรุณารอสักครู่..."  
  const loadingImg = 'https://lh5.googleusercontent.com/d/1FeMKOWqyshLdarXuYzLRvc3NduzWA3p6'  // logo กระทรวง
  
  Swal.fire({ 
    title:  textInAlert,
    // text: textInAlert,
    // html: "<h5 align='center'> เวลา <b id='timer_loading'></b> วินาที</h5>  ", // Show time increment
    // html: "<h5 align='center'>" + textAlert + "</h5>", // Show time increment
    // html: "<h5 align='center'>" + "ห้องตรวจ" + dataReturn[0].appointmentRoom + "</h5>" + "<h6 align='center'> วันนัด " + appointmentDateThai  + "</h6>" 
    allowOutsideClick: false,
    timer: 10000,   
    timerProgressBar: true,
    imageUrl: loadingImg, 
    imageWidth: 150,
    imageHeight: 150,
    didOpen: () => {
      Swal.showLoading()

      // *** Show time increment
      // const content = Swal.getHtmlContainer()
      // const $ = content.querySelector.bind(content)
      // const b = $('#timer_loading')

      // let number = 0;
      // let intervalId = setInterval(() => {
      //   // console.log(number);
      //   number++;
      //   b.textContent = number
      //   if (number > 10) {
      //     clearInterval(intervalId);
      //   }
      // }, 1000)
      
    },
     
    // *** Show img backdrop
    width: 400,
    padding: '1em',
    color: '#33B2FF',  // color text
    // background: 'https://lh5.googleusercontent.com/d/1FeMKOWqyshLdarXuYzLRvc3NduzWA3p6',
    backdrop: `
      // rgba(43, 165, 137, 0.6)  // color backdrop
      rgba(0, 0, 0, 0.6)
      // opacity 0.5
      // url("https://lh5.googleusercontent.com/d/1FeMKOWqyshLdarXuYzLRvc3NduzWA3p6")
      // left top
      // no-repeat
    `
  })
  
};



function loadingEnd(){
  Swal.close()
  
};




// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CREDIT COPYRIGHT
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


function createCopyRight(){
  document.getElementById("show_copyright").textContent = "แจ้งปัญหา: golfguitar@gmail.com"
  
};




// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PAGE VIEW SELECTION
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function showLastView(){
  const lastViewId = sessionStorage.getItem("sLastView") 
  console.log(lastViewId)

  if ( lastViewId != null){
    showViewById(lastViewId)
  } 
  else {
    const id = "home_view_btn"
    showViewById(id)
  }

  loadingEnd()

};


function activeTabChange(id){
  console.log(id)
  const elements = document.querySelectorAll(".nav-link"); // Select all elements with class "nav-link"
  // Loop through the selected elements and remove the class
  elements.forEach((element)=>{
    element.classList.remove("my-active")
  });

  const position = id.indexOf("oc") 
  // คลิ๊กที่ sidebar
  if ( position < 0 ){
    const child = document.getElementById(id)
    child.closest('.nav-pills li a').classList.add('my-active')

    const idOcBtn = id.replace("_btn", "_oc_btn")
    // console.log(idOcBtn)
    const childOc = document.getElementById(idOcBtn)
    childOc.classList.add('my-active')
    
  } 
  // คลิ๊กที่ offcanvas
  else if ( position >= 0 ){
    const child = document.getElementById(id)
    child.closest('.nav-pills li a').classList.add('my-active')

    const idOcBtn = id.replace("_oc_btn", "_btn")
    // console.log(idOcBtn)
    const childOc = document.getElementById(idOcBtn)
    childOc.classList.add('my-active')
    
  }


  
     
};





function showViewById(id){
  // console.log(id)
  clearView()

  if (id == "home_view_btn" || id == "home_view_oc_btn" ){
    console.log("home_view_btn")
    document.getElementById("home_view").classList.remove("d-none")
    sessionStorage.setItem("sLastView", "home_view_btn")
    activeTabChange(id)

  } 
  else if (id == "registration_view_btn" || id == "registration_view_oc_btn"){
    document.getElementById("registration_view").classList.remove("d-none")
    sessionStorage.setItem("sLastView", "registration_view_btn")
    activeTabChange(id)

  }
  else if (id == "pending_view_btn" || id == "pending_view_oc_btn"){
    document.getElementById("pending_view").classList.remove("d-none")
    sessionStorage.setItem("sLastView", "pending_view_btn")
    activeTabChange(id)

  }
  else if (id == "treat_view_btn" || id == "treat_view_oc_btn" ){
    document.getElementById("treat_view").classList.remove("d-none")
    sessionStorage.setItem("sLastView", "treat_view_btn")
    activeTabChange(id)

  }
  else if (id == "history_view_btn" || id == "history_view_oc_btn" ){
    document.getElementById("history_view").classList.remove("d-none")
    sessionStorage.setItem("sLastView", "history_view_btn")
    activeTabChange(id)

  }
  else if (id == "calendar_view_btn" || id == "calendar_view_oc_btn"){
    document.getElementById("calendar_view").classList.remove("d-none")
    sessionStorage.setItem("sLastView", "calendar_view_btn")
    activeTabChange(id)

  }
  else if (id == "dashboard_view_btn" || id == "dashboard_view_oc_btn"){
    document.getElementById("dashboard_view").classList.remove("d-none")
    sessionStorage.setItem("sLastView", "dashboard_view_btn")
    activeTabChange(id)

  }
  else if (id == "stock_view_btn" || id == "stock_view_oc_btn"){
    document.getElementById("stock_view").classList.remove("d-none")
    sessionStorage.setItem("sLastView", "stock_view_btn")
    activeTabChange(id)

  }
  else if (id == "setting_view_btn" || id == "setting_view_oc_btn"){
    document.getElementById("setting_view").classList.remove("d-none")
    sessionStorage.setItem("sLastView", "setting_view_btn")
    activeTabChange(id)

  }

};



function clearView(){
  document.getElementById("home_view").classList.add("d-none")
  document.getElementById("registration_view").classList.add("d-none")
  document.getElementById("pending_view").classList.add("d-none")
  document.getElementById("treat_view").classList.add("d-none")
  document.getElementById("history_view").classList.add("d-none")
  document.getElementById("calendar_view").classList.add("d-none")
  document.getElementById("dashboard_view").classList.add("d-none")
  document.getElementById("stock_view").classList.add("d-none")
  document.getElementById("setting_view").classList.add("d-none")

};







