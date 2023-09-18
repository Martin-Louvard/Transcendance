import { Avatar, Button, ButtonGroup, Card, CardContent, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Slider, Stack } from "@mui/material";
import { ClientEvents, ClientPayloads, LobbySlotCli, LobbySlotType, LobbyType } from "@shared/class";
import { useEffect, useLayoutEffect, useState } from "react";
import { Friend, Friendships } from "src/Types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { WebSocketState, deleteSentInvite, setLobbySlots, setLobbyType, setParams } from "../../../redux//websocketSlice";
  

export const MapParams: React.FC = (props) => {
	const mapParam = props.mapParam;
	const setMapParam = props.setMapParam;
	const size = props.size;
	const sliderSize = props.sliderSize;
	const sliderStyle =props.sliderStyle
  
	return (
	  <Card variant="outlined" sx={{marginX: size.width / 10 / 4, backgroundColor: 'transparent', color:'white'}}>
		<CardContent>
		  <p>Map parameters: </p>
		  <Stack spacing={size.width > 700 ? 16 : 2} direction={size.width > 700 ? "row" : "column"} sx={{ mb: 1, px: size.width > 1000 ? size.width / 10 / 4 : size.width > 700 ? size.width / 10 / 8 : 0} } alignItems="center">
			{/*Map Size*/}
			<Stack spacing={2} direction="column" sx={{ mt: 6, mb: 1}} alignItems="center">
			  <p>Map Size </p>
			  <Stack spacing={0} direction="column" sx={{ mb: 1}} alignItems="center">
				  
				<Stack spacing={5} direction="row" sx={{ mt: 0, mb: 1 }} alignItems="center">
				  <p>Width</p>
				  <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={sliderStyle}
				  onChange={(_, val) => {setMapParam(prev => ({...prev, size: [val as number, prev.size[1]]}))}}/>
				</Stack>
				<Stack spacing={5} direction="row" sx={{ mt: 0, mb: 1}} alignItems="center">
				  <p>Height</p>
				  <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={sliderStyle}
				  onChange={(_, val) => {setMapParam(prev => ({...prev, size: [prev.size[0], val as number]}))}}/>
				</Stack>
			  </Stack>
			</Stack>
			{/*Goal Size Size*/}
			<Stack spacing={2} direction="column" sx={{ mt: 30, mb: 1}} alignItems="center">
				<p>Goal Size</p>
				<Slider defaultValue={0} aria-label="Default" valueLabelDisplay="auto" max={mapParam.size[0]} min={Math.floor(mapParam.size[0] / 8)} sx={sliderStyle}
				onChange={(_, val) => {setMapParam(prev => ({...prev, goalSize: val as number}))}}/>
			</Stack>
			{/*Median Offset Size*/}
			<Stack spacing={2} direction="column" sx={{ mt: 30, mb: 1}} alignItems="center">
				<p>Median Offset</p>
				<Slider defaultValue={10} aria-label="Default" valueLabelDisplay="auto" max={40} min={0} sx={sliderStyle}
				onChange={(_, val) => {setMapParam(prev => ({...prev, medianOffset: val as number}))}}/>
			</Stack>
		  </Stack>
		</CardContent>
	  </Card>
	);
  }
  
 export const BallParam: React.FC = (props) => {
	const ballParam = props.ballParam;
	const setBallParam = props.setBallParam;
	const sliderSize = props.sliderSize;
	const size = props.size;
	const sliderStyle =props.sliderStyle
  
	return (
	  <Card sx={{backgroundColor: 'transparent', color:'white'}}>
		<p>Ball Parameters : </p>
		<CardContent>
		<Stack spacing={size.width > 700 ? 8 : 2} direction={size.width > 700 ? "row" : "column"} sx={{color:'white', mb: 1, px: size.width > 1000 ? size.width / 10 / 4 : size.width > 700 ? size.width / 10 / 8 : 0} } alignItems="center">
			<Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1, }} alignItems="center">
			  <p>Speed</p>
			  <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={sliderStyle}
			  onChange={(_, val) => {setBallParam(prev => ({...prev, globalSpeed: val as number}))}}/>
			</Stack>
			<Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1 }} alignItems="center">
			  <p>Rebound Force</p>
			  <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={sliderStyle}
			  onChange={(_, val) => {setBallParam(prev => ({...prev, reboundForce: val as number}))}}/>
			</Stack>
			<Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1 }} alignItems="center">
			  <p>Acceleration</p>
			  <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={sliderStyle}
			  onChange={(_, val) => {setBallParam(prev => ({...prev, ballAcceleration: val as number}))}}/>
			</Stack>
			<Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1 }} alignItems="center">
			  <p>Rotation Force</p>
			  <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={sliderStyle}
			  onChange={(_, val) => {setBallParam(prev => ({...prev, rotationForce: val as number}))}}/>
			</Stack>
		  </Stack>
		</CardContent>
	  </Card>
	);
  }
  
  export const PlayersParam: React.FC = (props) => {
	const playersParam = props.playersParam;
	const setPlayersParam = props.setPlayersParam;
	const sliderSize = props.sliderSize;
	const size = props.size;
	const sliderStyle =props.sliderStyle
  
	return (
	  <Card sx={{backgroundColor: 'transparent', color:'white'}}>
		<p>Players Parameters : </p>
		<CardContent>
		<Stack spacing={size.width > 700 ? 8 : 2} direction={size.width > 700 ? "row" : "column"} sx={{color:'white', mb: 1, px: size.width > 600 ? size.width / 10 / 3: size.width > 400 ? size.width / 10 / 8 : 0} } alignItems="center">
			<Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1, }} alignItems="center">
			  <p>Speed</p>
			  <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={150} min={10} sx={sliderStyle}
			  onChange={(_, val) => {setPlayersParam(prev => ({...prev, speed: val as number}))}}/>
			</Stack>
			<Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1 }} alignItems="center">
			  <p>Rotation Speed</p>
			  <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={100} min={10} sx={sliderStyle}
			  onChange={(_, val) => {setPlayersParam(prev => ({...prev, rotationSpeed: val as number}))}}/>
			</Stack>
			<Stack spacing={0} direction="column" sx={{ mt: 0, mb: 1 }} alignItems="center">
			  <p>Boost Force</p>
			  <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={500} min={100} sx={sliderStyle}
			  onChange={(_, val) => {setPlayersParam(prev => ({...prev, boostForce: val as number}))}}/>
			</Stack>
		  </Stack>
		</CardContent>
	  </Card>
	);
  }
  
  export const GeneralParam: React.FC = (props) => {
	const generalParam = props.generalParam;
	const setGeneralParam = props.setGeneralParam;
	const sliderSize = props.sliderSize;
	const size = props.size;
	const sliderStyle =props.sliderStyle
	
	return (
	  <Card sx={{backgroundColor: 'transparent'}}>
		<p>General Param</p>
		<Stack spacing={0} direction="column" sx={{mt: 0, mb: 1, color:'white'}} alignItems="center">
		  <p>Time (seconds)</p>
		  <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" max={600} min={60} sx={sliderStyle}
		  onChange={(_, val) => {setGeneralParam(prev => ({...prev, time: val as number}))}}/>
		</Stack>
	  </Card>
	);
  } 
  