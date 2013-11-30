alert('begin');
var bluetoothSerial = cordova.require('bluetoothSerial');
var elemBTindicator = document.getElementById('bluetooth_indicator'),
    elemLogBox = document.getElementById('logs_box');
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
        alert('app.bindEvents before');

        document.addEventListener('deviceready', this.onDeviceReady, false);

        alert('app.bindEvents after');
    },
    // deviceready Event Handler
    //
    onDeviceReady: function() {
        alert('app.onDeviceReady');

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