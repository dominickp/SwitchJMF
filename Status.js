/*
                                   
Author:	Dominick G. Peluso < www.linkedin.com/in/dominickpeluso >
Date:		September 11, 2014

Copyright © 2014

Creates a bash script that executes a cURL to a DFE which returns a
status response JMF.

-----------------------------------------------------------------------

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

*/

function jobArrived( s : Switch, job : Job )
{
	
	// Set flow element variables
	var detailType = s.getPropertyValue('DetailType');
	var deviceUrl = s.getPropertyValue('DeviceURL');
	var responseDataSetName = s.getPropertyValue('ResponseDataSetName');
	var debugLevel = s.getPropertyValue('DebugLevel');

	// Build JMF
	var request =    '<?xml version="1.0" encoding="UTF-8"?>' +
						'<JMF xmlns="http://www.CIP4.org/JDFSchema_1_1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" SenderID="MIS System" TimeStamp="2006-04-19T17:47:10-07:00" Version="1.2">' +
							'<Query ID="misb4c3c9f88d02c8ea" Type="Status" xsi:type="' + detailType + '">' +
								'<StatusQuParams DeviceDetails="Details" />' +
							'</Query>' +
						'</JMF>';

	
	// Build shell script
	var script = 	'#!/bin/sh' + '\n\n' +
				 	"curl -X POST -d '" + request + "'" + ' --header "Content-Type: application/vnd.cip4-jmf+xml" ' + deviceUrl '\n' +
				 	'echo';
	

	// Make temp shell script file
	var temp_shell_script = job.createPathWithName( job.getNameProper() + '_exec.sh' );
	var shellFile = new File(temp_shell_script);
	
	// Write to shell script
	shellFile.open(File.WriteOnly);
	shellFile.write(script);
	shellFile.close();
	
	// Make the temp file writeable	
	var String args = new Array();
	args[0] = "chmod";
	args[1] = "777";
	args[2] = temp_shell_script;
	var exitStatus = Process.execute(args);
	
	// Process the temp shell script
	var String args = new Array();
	args[0] = temp_shell_script;
	var exitStatus = Process.execute(args);
	
	// Grab some variables
	var curlResponse = Process.stdout;
	var curlError = Process.stderr;
	
	// Write private data
	//job.setPrivateData(ResponsePrivateDataKey, curlResponse);
	
	// Save as data set
	var responseDataset = job.createDataset('XML');
	var responseDatasetPath = responseDataset.getPath();
	var datasetResponseFile = new File( responseDatasetPath );
	datasetResponseFile.open(File.WriteOnly)
	datasetResponseFile.write(curlResponse);
	datasetResponseFile.close();
	job.setDataset(responseDataSetName, responseDataset);
	
	// Finish
	job.sendToData(1, job.getPath());
	job.sendToLog(1, temp_shell_script);
	
	// Log
	if(debugLevel == 1){
		s.log(2, script);
		s.log(2, curlResponse);
		s.log(2, curlError);
		s.log(2, temp_shell_script);
	}	
	
}