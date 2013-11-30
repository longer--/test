var bluetoothSerial = cordova.require('bluetoothSerial'),
    elemBTindicator = document.getElementById('bluetooth_indicator'),
    elemLogBox = document.getElementById('logs_box');

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent();
    },
    // Update DOM on a Received Event
        //receivedElement = parentElement.querySelector('.received');
        //receivedElement.setAttribute('style', 'display:block;');
    receivedEvent: function() {
        app.logm('Устройство готово')
        bluetooth.status();
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