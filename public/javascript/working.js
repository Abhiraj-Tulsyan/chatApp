console.log('working');


var chatApp=angular.module('chatApp' , ['ngRoute'])



chatApp.config(function($routeProvider){ 

    $routeProvider.when( '/' , { templateUrl : '/views/homepage.html', controller:'HomeController'})
    .when('/rooms' , { templateUrl: '/views/room.html' })
    .otherwise({ templateUrl: '/views/other.html'})
})



chatApp.controller('HomeController' , ['$scope' , '$rootScope','$http' , function($scope,$rootScope,$http){

$scope.joinRoomName='';
$scope.createRoomName='';

$rootScope.roomname='';
$scope.joiningRoom=function()
{
    var data={
        roomName: $scope.joinRoomName
    }
$http.post('/joinTheRoom' , data ).then(function(data){
console.log(data.status);
if(data.status==204)
{
    alert('room is full or does not exist');
}
if(data.status==200)
{
    $rootScope.roomname=$scope.joinRoomName;
    console.log($rootScope.roomname)
    location.assign('#/rooms')
}


}, function(err){ 
alert('some error occured')

})



}






$scope.creatingRoom=function()
{
    var data2={
        roomName: $scope.createRoomName
    }
$http.post('/createTheRoom' , data2 ).then(function(data){
console.log(data.status);
if(data.status==204)
{
    alert('room already exists');
}
if(data.status==200)
{
    $rootScope.roomname=$scope.createRoomName
    console.log($rootScope.roomname )
    
    location.assign('#/rooms')
}


}, function(err){ 
alert('some error occured')

})



}




}])
chatApp.controller('RoomController' , [ '$scope' , '$http' , '$rootScope', '$timeout', function($scope,$http, $rootScope, $timeout){

  if(!$rootScope.roomname)
  {
      location.assign("#/")
  }
  
    console.log($rootScope.roomname);
    var data={
        roomName:$rootScope.roomname
    }






    $scope.currentUser='';
    $scope.socketid=[];
    $scope.userId=[];
$http.post('/getSocketId' , data).then(function(data){ console.log(data.data);$scope.currentUser=data.data }, function(err){ alert('some error occured') })

var socket=io( );
socket.emit('joinTheRoom' , $rootScope.roomname)
socket.on('newUserConnected' , function(socketId , userId){
    $scope.$apply(function(){ $scope.socketId=Object.keys(socketId.sockets)
       $scope.userId=[]
        userId.forEach(function(user)
        {
data={ userId: user , typing:false}
$scope.userId.push(data);

        })
        console.log($scope.socketId);
        console.log($scope.userId);
     })
})
socket.on('userDisconnected' , function(id)
{
    console.log(id);
    var tempIndex=($scope.socketId).indexOf(id);
    if(tempIndex==-1)
    {
return;
    }
else
{
    socket.emit('deleteUser' , tempIndex,$rootScope.roomname,$scope.userId[tempIndex])
}


})


socket.on('userRemoved' , function(socketId , userId){
    $scope.$apply(function(){ $scope.socketId=Object.keys(socketId.sockets)
     $scope.userId=[];
        userId.forEach(function(user)
        {
data={ userId: user , typing:false}
$scope.userId.push(data);

        })
        console.log($scope.socketId);
        console.log($scope.userId);
     })
})
socket.on('userIsTyping', function(typingUser)
{

    $scope.$apply(function(){
$scope.userId.forEach(function(user)
{
    if(user.userId==typingUser)
    {
        user.typing=true;
    }
$timeout(function(){user.typing=false} , 1000)

})


        
    })
})



socket.on('newMessageRecieved', function(message, userName)
{
    console.log('somehowreachedhere')
    newMessage=document.createElement('div');
    newMessage2=document.createElement('p')
    span=document.createElement('span')
    user=document.createTextNode('-'+ userName);
    span.appendChild(user);
content=document.createTextNode(message);
newMessage2.appendChild(content);
span.className='userShowingleft'

newMessage.appendChild(newMessage2)

newMessage.appendChild(span);
div=document.getElementById('start');
div.id='beforeStart';
div.insertAdjacentElement('afterend' , newMessage);
newMessage.id='start';
newMessage.className='otherMessage'
})

$scope.messageValue=''

$scope.messageSend=function()
{

newMessage=document.createElement('div');
newMessage2=document.createElement('p')
span=document.createElement('span');
userText=document.createTextNode('you')
span.appendChild(userText);
span.className='userShowing';
content=document.createTextNode($scope.messageValue);
newMessage2.appendChild(content);
newMessage.appendChild(newMessage2)
newMessage.appendChild(span);
div=document.getElementById('start');
div.id='beforeStart';
div.insertAdjacentElement('afterend' , newMessage);
newMessage.id='start';
newMessage.className='selfMessage'
socket.emit('chatMessage', $scope.messageValue,$rootScope.roomname,$scope.currentUser);
newMessage.scrollIntoView();
$scope.messageValue=''
}

$scope.userTyping=function()
{
    socket.emit('TypingUser', $scope.currentUser ,$rootScope.roomname);
}




var intervalId=setInterval(function()
{
    if(socket.disconnected)
    {
        alert('disconnected')
        stopInterval()
        location.assign('#/');
    }
} , 5000 )
 
function stopInterval()
{
    clearInterval(intervalId)
}


socket.on('randomStuff' , function(data){ console.log(data , 'reached here')})




}])





























