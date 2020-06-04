const key = '03fb54ebf904aeecf7fbb0e169f0c7ad';
const urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&appid=${key}`;
const urlWeather5 = `https://api.openweathermap.org/data/2.5/forecast?q=Minsk&appid=${key}`;
const weather = document.querySelector('.weather')
const kelvin = 273.15

function fetchData(url) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onload = () => resolve(JSON.parse(xhr.response))
    xhr.onerror = () => reject(xhr.statusText)
    xhr.send()
    
    })
}

fetchData(urlWeather)
    .then(data => { 
        console.log(data)
        const dataCurrent = new renderWeatherWidget(data)

        console.log(dataCurrent)
        dataCurrent.render(document.body)
        return fetchData(urlWeather5)
        
})  
    .then(data5 => {
    console.log(data5)
    
    renderWeatherWidget5(data5)

    
})
    .catch((error) => {
        console.error(error)
    });

class renderWeatherWidget {    
    constructor(data) {
        
        this.city = data.name
        this.state = data.sys.country
        this.tempKelvin = data.main.temp
        this.tempKelvinFeelsLike = data.main.feels_like
        this.windDeg = data.wind.deg
        this.windSpeed = data.wind.speed
        this.icon = data.weather[0].icon
        this.urlIcon = this._getUrlIcon()
        this.time = data.dt
        this.timeFull = this._getFullTime()
        this.tempFromKelvin = this._getTempFromKelvin()
        this.tempFromKelvinFeelsLike = this._getTempFromKelvinFeelsLike()
        this.direct = this._getDirectionWind()
        this.windSpeedNow = this._getWindSpeed()

    }

    _getUrlIcon() {
        return `http://openweathermap.org/img/wn/${this.icon}@2x.png`
    }

    _getFullTime() {
        let minutes = new Date(this.time*1000).getMinutes()
        minutes = (minutes < 10) ? ':0' + minutes: ':' + minutes;
        const time = new Date(this.time*1000).getHours() + minutes;
        return time
    }

    _getTempFromKelvin() {
        return  this.tempKelvin - kelvin + ' C'
    }

    _getTempFromKelvinFeelsLike() {
        return Math.round(this.tempKelvinFeelsLike - kelvin) + ' C'
    }

    _getDirectionWind() {
        let direct = this.windDeg

        if (direct > 315 || direct <= 45){
            direct = 'Nord'
        } else if (direct <= 135){
            direct = 'East'
        } else if (direct <= 225){
            direct = 'South'
        } else if (direct <= 315){
            direct = 'Wind'
        }

        return direct
    }

    _getWindSpeed() {
        return  this.windSpeed + ' m/s'
    }   

    render(parent) {
        const template = `
            <div class= "weather_now">
                <p>${this.city}, ${this.state}</p>
                <p><i class="far fa-clock"></i> ${this.timeFull}</p>
                <div class= "weather_now_main">
                    <img src="${this.urlIcon}">
                    <p>${this.tempFromKelvin}</p>
                    <p> Feels like ${this.tempFromKelvinFeelsLike}</p>
                </div>
                <div class = "wind_now">
                    <div class = "wind_direction"><i class="fas fa-location-arrow"></i> ${this.direct}</div>
                    <div class = "wind_speed"><i class="fas fa-wind"></i> ${this.windSpeedNow}</div>
                </div>
            </div>

    `
    parent.innerHTML = parent.innerHTML + template

    }
}    

function renderWeatherWidget5(data5) {
    const weatherLater = data5.list

    for ( let i = 7; i < weatherLater.length; i+=8 ) {
        const dataForecast = new renderWeatherWidgetForecast(weatherLater[i])
        
        dataForecast.render(document.body)
    }

}

class renderWeatherWidgetForecast {
    constructor(weatherLaterIndex) {
      
        this.date = weatherLaterIndex.dt_txt
        this.icon = weatherLaterIndex.weather[0].icon
        this.tempKelvin = weatherLaterIndex.main.temp
        this.month = this._getMonth()
        this.time = this._getTime()
        this.urlIcon = this._getUrlIcon()
        this.tempFromKelvin = this._getTempFromKelvin()

    }

    _getTime() {
        return new Date(this.date).getDate()+' '+ this.month
        +' '+new Date(this.date).getHours()+'a.m'
    }

    _getMonth() {
        const monthIndex = new Date(this.date).getMonth() 
           
        function getMonth(month) {
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                    
            return months[month]
        }
        const month = getMonth(monthIndex)

        return month
    }

    _getUrlIcon() {
        return `http://openweathermap.org/img/wn/${this.icon}@2x.png`
    }

    _getTempFromKelvin() {
        return Math.round(this.tempKelvin - kelvin)
    }

    render(parent) {
        const template =`
            <div class= "weather_later">
                <div class= "weather_later_time">${this.time}</div>
                <div class= "weather_later_icon">
                    <img src=${this.urlIcon}>
                </div>
                <div class= "weather_later_temp">${this.tempFromKelvin} <i class="fas fa-temperature-low"></i> C</div>
            </div>
    `  
    parent.innerHTML = parent.innerHTML + template    

    }
}






