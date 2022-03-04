import React, {useState} from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Wrapper } from "@googlemaps/react-wrapper";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import * as FaIcons from "react-icons/fa";
import * as GrIcons from "react-icons/gr";
import MapStyle from './MapStyle'
import "./Drawer.css";

const mapContainerStyle = {
    width: "100vw",
    height: "100vh"
}
const center = {
    lat: 1.352083,
    lng: 103.819839
}
const options = {
    styles: MapStyle,
    disableDefaultUI: true,
    zoomControl: true
}

const libraries = ["places"];


export function Main({ onSend }) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });
    

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current  = map;
    }, [])

    if (loadError) return "Error loading map"
    if (!isLoaded) return "Loading Map"

    return <div>
        <GoogleMap
        mapContainerStyle = {mapContainerStyle}
        zoom={12.8}
        center={center}
        options={options}
        onLoad={onMapLoad}
        ></GoogleMap>
        
        <Router>
            <Drawer onSend={onSend}/>
        </Router>
        
    </div>
}

const Drawer = ({ onSend }) => {
    const [burger, setDrawer] = useState(false)
    const showDrawer = () => setDrawer(!burger)

    const [start, setStart] = useState("")
    const [dest, setDest] = useState("")
    const [rack, setRack] = useState(false)

    const onSubmit = (e) => {
        e.preventDefault()
        if (!start) {
            alert("Please enter starting location")
            return
        }
        onSend({ start, dest, rack })
    }

    return (
        <>
            <div className={burger ? "burger" : "not-burger"}>
                <Link to="#" className="menu-bars">
                    <FaIcons.FaBars onClick={showDrawer}/>
                </Link>
            </div>
            <nav className={burger ? "nav-menu active" : "nav-menu"}>
                <ul className='nav-menu-items'>
                    <li className="navbar-toggle">
                        <Link to="#" className='menu-bars'>
                            <GrIcons.GrClose onClick={showDrawer}/>
                        </Link>
                    </li>
                    <li>
                        <form className="add-form" onSubmit={onSubmit}>
                            <div className="form-control">
                                <label className="form-control-header">Starting Location</label>
                                <Search 
                                    placeholder="Starting Location"
                                    setInput={({lat, lng})=>setStart({lat, lng})}
                                />
                            </div>
                            <div className="form-control">
                                <label className="form-control-header">Ending Location</label>
                                <Search 
                                    placeholder="Ending Location"
                                    setInput={({lat, lng})=>setDest({lat, lng})}
                                />
                            </div>
                            <div className="form-control form-control-check">
                                <label className="form-control-header">Set nearest racks as destination</label>
                                <input 
                                type="checkbox"
                                checked={rack}
                                value={rack}
                                onChange={(e)=>setRack(e.currentTarget.checked)}
                                />
                            </div>
                            <input 
                            type="submit" 
                            value="Submit" 
                            className="btn btn-block"/>
                        </form>
                    </li>
                </ul>
            </nav>
        </>
    )
}

function Search({placeholder, setInput}) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions
      } = usePlacesAutocomplete();
    
      const renderSuggestions = () => {
        const suggestions = data.map(({ place_id, description }) => (
          <ComboboxOption key={place_id} value={description} />
        ));
    
        return (
          <>
            {suggestions}
          </>
        );
      };

      return (
        <div>
          <Combobox onSelect={async (address) => {
              setValue(address, false);
              clearSuggestions();
              try {
                const results = await getGeocode({address});
                const { lat, lng } = await getLatLng(results[0]);
                console.log(placeholder, {lat, lng});
                setInput({lat, lng})
              } catch(error) {
                  console.log("error in Search onSelect")
              }
              console.log(address);
              }}
            >
            <ComboboxInput
              value={value}
              placeholder={placeholder}
              onChange={(e) => {setValue(e.target.value);}}
              disabled={!ready}
            />
            <ComboboxPopover>
              <ComboboxList>{status === "OK" && renderSuggestions()}</ComboboxList>
            </ComboboxPopover>
          </Combobox>
        </div>
      );
}