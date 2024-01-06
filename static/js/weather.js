const api_key =  "9988227a0c4b43101da34b728f1e3873";
const url = "https://api.openweathermap.org/data/2.5/";


function  getResult  (city)  {
    let query = `${url}weather?q=${city}&appid=${api_key}`
    fetch(query)
    .then(response => response.json())
    .then(data => {
        const weatherId = data.weather[0].id;
        const isRainy = (weatherId >= 500 && weatherId <= 531);

        if (isRainy) {
        $("#myToast").toast("show");
        }else{
            console.log("Not rainy")
        }
    })
    .catch(error => {
        console.error('Hava durumu bilgisi alınamadı:', error);
  });}
 