
//localStorage.removeItem("pnFIAOMn");
var App = angular.module("App", ["firebase"]);

App.controller("AppCtrl", function($scope, $firebaseArray) {
	$scope.scopebarChartData=[];
	//$scope.showSpinner=false;
	if(localStorage.getItem("pnFIAOMn"))
	{
		$scope.voted=true;	
		$scope.hideResults=false;
		$scope.subTitle="Real time results";
		$scope.youVotedFor="You voted for "+localStorage.getItem("pnFIAOMn");
		$scope.refreshResults=true;
		$scope.setWidth="10%";
		
	}
	else
	{
	$scope.voted=false;	
	$scope.hideResults=true;
	$scope.subTitle="KEEP CALM AND VOTE WISELY";	
	}
  var ref = new Firebase("https://vote-color.firebaseio.com/");
  

  $scope.colors = $firebaseArray(ref);
  $scope.add = function() {
    if ($scope.name) {
      $scope.colors.$add({
        name: $scope.name,
        count: 0
      });
	  
	  
	  
    } else {
      alert("Can't be blank..");
    }
    $scope.name = "";
  };
  
	ref.on('value', function(snapshot) {
		
    //$scope.showSpinner=true;
	 var voteCountArr = [];
	 snapshot.forEach(function (childSnapshot) {
		  var obj = childSnapshot.val();
          if(!isNaN(obj.count))
		  voteCountArr.push(obj.count);   
		  
	 })
	 $scope.scopebarChartData.length = 0;
			var totalVotes=voteCountArr.reduce($scope.getSum);
			
			snapshot.forEach(function (childSnapshot) {
		  var obj = childSnapshot.val();
		  var barChartDataObj = {};
		  
		  barChartDataObj['percentage']=((obj.count/totalVotes) * 100).toFixed(0);
		  
		  if(isNaN(barChartDataObj['percentage']))
		  {
			  barChartDataObj['percentage']=0;
			  barChartDataObj['count']=0;
			  barChartDataObj['percentageinfo'] = 0+"%"+"(0)";
		  }
		  else
		  {
			  barChartDataObj['count']=obj.count;
		  barChartDataObj['percentageinfo'] = ((obj.count/totalVotes) * 100).toFixed(0).toString()+"%"+"("+obj.count+")";
		  }
		  barChartDataObj['CandidateDetails'] =obj.name+"-"+obj.party;
		  barChartDataObj['css'] ='html5';
		  $scope.scopebarChartData.push(barChartDataObj);
			})
			$scope.refreshResults=true;
			//$scope.scopebarChartData = barChartDataObj;
		  //$scope.showSpinner=false;
	 });
	 
	 
	 
	// )
	
//});

$scope.getSum=function(total, num) {
    return total + num;
};

  $scope.vote = function(color) {
    color.count += 1;
    $scope.colors.$save(color);
	$scope.voted=true;
	$scope.hideResults=false;
	$scope.subTitle="Real time results";
	$scope.setVoterPrefferedCandidate(color.name);
  };
  
  $scope.setVoterPrefferedCandidate=function(name){
	if (typeof(Storage) !== "undefined") {
    // Store
    localStorage.setItem("pnFIAOMn", name);
	$scope.youVotedFor="You voted for "+name;
	
    // Retrieve
    //document.getElementById("result").innerHTML = localStorage.getItem("lastname");
} else {
    //document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
}  
  };
  
  
  $scope.delete = function(color) {
    $scope.colors.$remove(color);
  };
});
