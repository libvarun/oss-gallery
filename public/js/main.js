/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by APS Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

$(document).ready(function () {
  let viewState = 'buckets';
  async function getBuckets() {
    let res = await fetch('/api/aps/oss/buckets')
    let buckets = JSON.parse( await res.text() )
    let bucketlist = ''
    for (let index = 0; index < buckets.length; index++) {
      const element = buckets[index];
      bucketlist +=`<div class='bucket_folder' data-id='${element.id}'>
                      <i class="fa-regular fa-folder" style="font-size:150px;color:#34b7eb;margin-right:50px;"></i><br>
                      <span style="float: left;">${element.id}</span>
                    </div>`
    }
    $('.gallery').html(bucketlist)
    $('.bucket_folder').click(async(e)=>{
      let bucketid = $(e.currentTarget).attr("data-id")
      let res = await fetch(`/api/aps/oss/buckets?id=${bucketid}`)
      let objects = JSON.parse( await res.text() )
      let objectslist = ''
      for (let index = 0; index < objects.length; index++) {
        const element = objects[index];
        objectslist +=`<div class='item' data-id='${element.id}'>
        <img src="${location.protocol }//${location.host + location.pathname }api/aps/oss/thumbnails/?id=${element.id}" ><br>
                        <span style="float: left;">${element.text}</span>
                      </div>`
      }
      $('.objects').html(objectslist)
      $('.objects').show()
      $('.gallery').hide()
      $('.item').click(async(e)=>{
        let urn = $(e.currentTarget).attr("data-id")
        launchViewer(urn)
        $('.objects').hide()
        $('#apsViewer').show()
        viewState = 'viewer'
      })
      $('.backbtn').show()
      viewState = 'items'
      console.log(objects)
    })
    
  }
  $('.backbtn').click((e)=>{
    switch (viewState) {
      case 'items':
        $('.backbtn').hide()
        $('.objects').hide()
        $('.gallery').show()
        viewState = 'buckets'
        break;
      case 'viewer':
        $('.objects').show()
        $('#apsViewer').hide()
        viewState = 'items'
        break;
    
      default:
        break;
    }
  })
  getBuckets()
})
