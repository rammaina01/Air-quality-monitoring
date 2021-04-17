import React from 'react'
import './Air.css'
import $ from 'jquery'

import {w3cwebsocket as sock} from 'websocket'

const header = ['City','Current AQI','Last Updated'];



const client = new sock('ws://city-ws.herokuapp.com')

class Air extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            data : [],
            time : ''
        }
    }
    componentDidMount(){
      client.onopen = ()=>{
          console.log('Web Socket Client Connected..')
      }  
      
      client.onmessage = (message) =>{
            this.setState({
                data : $.parseJSON(message.data),
                time : message.timeStamp
            })
      }
    }


    handleUpdateMessage = (data) => {
            data.forEach(({city, aqi}) => console.log(`The AQI of ${city} is ${aqi}`));
        }
    
    getColors = (value) =>{
        if(value >=0 && value <= 50 ){
            return 'rgb(49, 105, 1)'
        } else if(value >=51 && value <= 100 ){
            return 'rgb(110, 184, 64)'
        }
        else if(value >=101 && value <= 200 ){
            return 'rgb(219, 219, 9)'
        }else if(value >=201 && value <= 300 ){
            return 'orange'
        }else if(value >=301 && value <= 400 ){
            return 'green'
        }else{
            return 'rgb(168, 50, 50)'
        }
    }

    render() {
        this.handleUpdateMessage(this.state.data)
        
        let t = new Date(this.state.time).toLocaleTimeString()
        return (
            <div className="container">
                <h3>Air quality data</h3>
                <table className="table">
                    <thead>
                       <tr>{header.map((v, i) => <td key={i}>{v}</td>)}</tr> 
                    </thead>
                    <tbody>
                        {this.state.data.map((d, index)=>{
                            let aqi = d.aqi.toFixed(2)
                            return(
                                <tr key={index}>
                                <td>{d.city}</td>
                                <td style={{color: this.getColors(aqi)}}>{aqi}</td>
                                <td>{t}</td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Air