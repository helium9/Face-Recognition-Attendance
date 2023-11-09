import React from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import { useState, SetStateAction } from 'react';
import "./styles.css"
import { Input, Spacer } from "@nextui-org/react";

function Student_details() {

    const attend_perc = (val, total)=>{
        return ((total-val)/total)*100;
    }
    const [prescolor, setprescolor] = useState("red");
   
    const [month, setMonth] = useState("January");
    const handleMonthChange=(key)=>{
        setMonth(key);
        // console.log( key);
    }
 
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    console.log("month", month)
  return (
    <div id="main">
      <label style={{ fontSize:'2.5rem'}} htmlFor="fname" >Name</label>
      <Input id="name" disabled placeholder="Disabled" />

      <label style={{ fontSize:'2.5rem'}} htmlFor="fname" >Roll Number</label>
      <Input id="rno" disabled placeholder="Disabled" />

      <Dropdown>
        <DropdownTrigger>
          <Button id = "btn"style={{marginBottom:'20px', marginTop:'20px'}}>select month</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key = "January" onAction={()=>handleMonthChange("January")}>January</DropdownItem>
          <DropdownItem key = "February" onAction={()=>handleMonthChange("February")}>February</DropdownItem>
          <DropdownItem key = "March" onAction={()=>handleMonthChange("March")}>March</DropdownItem>
          <DropdownItem key = "April" onAction={()=>handleMonthChange("April")}>April</DropdownItem>
          <DropdownItem key = "May" onAction={()=>handleMonthChange("May")}>May</DropdownItem>
          <DropdownItem key = "June" onAction={()=>handleMonthChange("June")}>June</DropdownItem>
          <DropdownItem key = "July" onAction={()=>handleMonthChange("July")}>July</DropdownItem>
          <DropdownItem key = "August" onAction={()=>handleMonthChange("August")}>August</DropdownItem>
          <DropdownItem key = "September" onAction={()=>handleMonthChange("September")}>September</DropdownItem>
          <DropdownItem key = "October" onAction={()=>handleMonthChange("October")}>October</DropdownItem>
          <DropdownItem key = "November" onAction={()=>handleMonthChange("November")}>November</DropdownItem>
          <DropdownItem key = "December" onAction={()=>handleMonthChange("December")}>December</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Button id = "btn" onPress={onOpen}>click to view attendance</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent style={{marginTop:'15rem'}}>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 mt-30">
                attendance for the month of {month}
              </ModalHeader>
              <ModalBody>
                <div className="list" style={{alignItems:'center', justifyContent:'center'}}>
                  <div className="day" style={{ color: prescolor }}> 1st {month} </div>
                  <div className="day" style={{ color: prescolor }}> 2nd {month} </div>
                  <div className="day" style={{ color: prescolor }}> 3rd {month} </div>
                  <div className="day" style={{ color: prescolor }}> 4th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 5th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 6th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 7th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 8th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 9th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 10th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 11th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 12th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 13th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 14tg {month} </div>
                  <div className="day" style={{ color: prescolor }}> 15th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 16th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 17th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 18th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 19th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 20th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 21th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 22nd {month} </div>
                  <div className="day" style={{ color: prescolor }}> 23rd {month} </div>
                  <div className="day" style={{ color: prescolor }}> 24th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 25th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 26th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 27th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 28th {month} </div>
                  <div className="day" style={{ color: prescolor }}> 29th {month} </div>
                  {month!=='February' && <div className="day" style={{ color: prescolor }}> 30th {month} </div>}
                  {month!=='February' && month!=='April' &&month!=='June' &&month!=='September' &&month!=='November' && <div className="day" style={{ color: prescolor }}> 31st {month} </div>}

                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Student_details;
