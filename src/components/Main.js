import React, {Component} from 'react';
import { Row, Col } from 'antd';
import axios from "axios";
import SatSetting from './SatSetting';
import SatelliteList from './SatelliteList';
import WorldMap from './WorldMap';
import { SAT_API_KEY, BASE_URL, NEARBY_SATELLITE, STARLINK_CATEGORY } from "../constants";

class Main extends Component {
    state = {
        setting:{},
        satList:[],
        satInfo:{},
        isLoadingList: false
    }
    showNearbySatellite = (setting) => {
        console.log('show nearby')
        this.setState({
            setting: setting
        })
        // fetch sat list from the server
        this.fetchSatellite(setting);
    }

    fetchSatellite = setting =>{
        // step1: get setting
        // step2: send req to the server and display loading icon
        // step3: get the res form the server
        // case1: success-> update satList, unmount loading icon 
        // case2: fail -> info user, unmount loading icon 
        console.log("fetching")
        const { latitude, longitude, elevation, altitude } = setting;
        const url = `${BASE_URL}/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;
        this.setState({
            isLoadingList: true
        });
        axios.get(url)
            .then(res => {
                if(res.status === 200){
                    console.log(res.data);
                    this.setState({
                        satInfo: res.data,
                        isLoadingList: false
                    })
    
                }
            })
            .catch( error => {
                console.log('err in fetch satellite -> ', error);
            })
            .finally( () => {
                this.setState({ isLoadingList: false })
            })
    }
    showMap = selected => {
        this.setState(prestate =>({
            ...prestate, // 其他值不变
            satList:[...selected]
        }))
    }

    render() {
        const { satInfo, isLoadingList, satList, setting } = this.state;


        return (
            <Row className='main'>
            <Col span={8} className="left-side">
                <SatSetting onShow = {this.showNearbySatellite}/>
                <SatelliteList satInfo={satInfo}
                                   isLoad={isLoadingList}
                                   onShowMap={this.showMap}
                />

            </Col>
            <Col span={16} className="right-side">
                <WorldMap satData={satList} observerData={setting}/>
            </Col>
        </Row>
        );
    }
}
export default Main;
