alert('begin');
//var bluetoothSerial = cordova.require('bluetoothSerial');
// var elemBTindicator = document.getElementById('bluetooth_indicator'),
//     elemLogBox = document.getElementById('logs_box');
alert('after var');

var app = {
    // Application Constructor
    initialize: function() {
        alert('app.initialize');

        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        alert('app.bindEvents');

        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        alert('app.onDeviceReady');

        app.receivedEvent();
    },
    // Update DOM on a Received Event
        //receivedElement = parentElement.querySelector('.received');
        //receivedElement.setAttribute('style', 'display:block;');
    receivedEvent: function() {
        alert('app.receivedEvent');

        //app.logm('Устройство готово')
        //bluetooth.status();
    },
    logm: function(m){
        var newMess = document.createElement('p');
        newMess.innerHTML = m;
        elemLogBox.appendChild(newMess);
    }
};
var bluetooth = {
    status: function(){
        if(bluetoothSerial){
            app.logm('Bluetooth включен');
            elemBTindicator.innerText = 'Bluetooth on';
        } else {
            app.logm('Bluetooth выключен');
            elemBTindicator.innerText = 'Bluetooth off';
        }
    },
    isEnabled: function(){
        bluetoothSerial.isEnabled(
            function() { 
                alert("Bluetooth is enabled");
            },
            function() { 
                alert("Bluetooth is *not* enabled");
            }
        ); 
    }//,
    // list : function(){
    //     bluetoothSerial.list(app.ondevicelist, app.generateFailureFunction("List Failed"));      
    // }
};