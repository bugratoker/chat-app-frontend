import React from 'react'
import {useState} from 'react';
import{useFormik} from 'formik';
import axios from 'axios';
import App from '../App';

function RegisterPage() {
   
    let baseURL = 'http://localhost:8082/v1/user/save';
    const formik = useFormik({
        initialValues: {
          firstName: '',
          lastName: '',
          email: '',
          password:''
        },
        onSubmit: values => {
          alert(JSON.stringify(values, null, 2));
          console.log("submitlendi");
          createUser(values);
          <App />
          
        },
      });
      function createUser(user) {
        axios
          .post(baseURL, {
            name: user.firstName,
            surname: user.lastName,
            email:user.email,
            password:user.password
          })
          .then((response) => {
            console.log(response);
          });
      }


      return (
        <form onSubmit={formik.handleSubmit} style={{textAlign:'center',marginTop:'150px'}}>
          
          <label htmlFor="firstName">First Name</label>
          <br/>
          <input
            id="firstName"
            name="firstName"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.firstName}
            style={{marginBottom:'20px'}}
          />
          <br/>

          <label htmlFor="lastName">Last Name</label>
          <br/>
          <input
            id="lastName"
            name="lastName"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.lastName}
            style={{marginBottom:'20px'}}
          />
          <br/>

          <label htmlFor="email">Email Address</label>
          <br/>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            
          />
          <br/>
          <br/>          
          <label htmlFor="password">Password</label>
          <br/>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            
          />
          <br/><br/>
          <button type="submit">Submit</button>
        </form>
      );

}


export default RegisterPage