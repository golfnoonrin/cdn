
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

  // loadingEnd()

};
