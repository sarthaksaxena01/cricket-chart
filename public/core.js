var app=angular.module('cricketApp',[]);
app.controller('mainController',function($scope,$http) {
    $scope.data=[];
    $scope.incorrectAnswers=[];
    $scope.clearData=0;
    $scope.remainingQuestion=null;
    var dataSent={};
    $http.get('Data.js')
        .then(function(res){
            $scope.data=res.data;
            $scope.data.map(function(item,index){
                item.answerSelected="";
            });
        })

    $scope.checkAll=function(){
        var correct=0,incorrect=0;
        $scope.clearData=0;
        $scope.incorrectAnswers=[],$scope.remainingQuestion=null;

        for(var i=0;i<$scope.data.length;i++){
            if($scope.data[i].answerSelected==""){
                $scope.remainingQuestion=i;
                break;
            }
        }

        if(i==$scope.data.length){
            $scope.data.map(function(item,index){
                if(item.correct_answer==item.answerSelected)
                    correct=correct+1;
                else{
                    incorrect=incorrect+1;
                    $scope.incorrectAnswers.push(Number(index));
                }
        });

        dataSent.correct=correct;
        dataSent.incorrect=incorrect;
        
        $scope.myData=[{"Label":"Correct","Number":dataSent.correct},{"Label":"Incorrect","Number":dataSent.incorrect}];

        }
        
    }

    $scope.clears=function(){
        $scope.data.map(function(item,index){
                item.answerSelected="";
        });
        $scope.clearData=1;
        $scope.myData=null;
    }
})

app.directive('barsChart',function($parse){
    var directiveDefinitionObject={
        restrict:'E',
        replace:false,
        scope:{
            data:'=chartData'
        },
        link:function(scope,element,attrs){
            function inits(data){
                var chart=d3.select(element[0]);
                var x=chart.append("div").attr("class","chart");
                var y=x.selectAll("div").data(scope.data).enter().append("div");
                var z=y.transition().ease("elastic").style("width",function(d){return d*10 + "%" ;});
                var texts=z.text(function(d) { return d*10 + "%"; });
            }

            function inits2(data){
                var chart=d3.select(element[0]);
                var margin = {top: 20, right: 20, bottom: 70, left: 40},
                width = 400 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

                var x=d3.scale.ordinal().rangeRoundBands([0,width],0.05);
                var y=d3.scale.linear().range([height,0]);

                var xAxis=d3.svg.axis().scale(x).orient("bottom");
                var yAxis=d3.svg.axis().scale(y).orient("left").ticks(10);

                var svg = chart.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")");

                //data=JSON.parse(data);
                data.forEach(function(d) {
                    d.Label = d.Label;
                    d.Number = +d.Number;
                });
    
                  // scale the range of the data
                  x.domain(data.map(function(d) { return d.Label; }));
                  y.domain([0, d3.max(data, function(d) { return d.Number; })]);

                  svg.select('.y').transition().duration(1000)
                        .call(yAxis);

                  // add axis
                  svg.append("g")
                      .attr("class", "x axis")
                      .attr("transform", "translate(0," + height + ")")
                      .call(xAxis)
                    .selectAll("text")
                      .style("text-anchor", "end")
                      .attr("dx", "1.6em")
                      .attr("dy", ".45em")
                      
                  svg.append("g")
                      .attr("class", "y axis")
                      .call(yAxis)
                    .append("text")
                      .attr("transform", "rotate(-90)")
                      .attr("y", 5)
                      .attr("dy", ".71em")
                      .style("text-anchor", "end")
                      .text("Number");

                  // Add bar chart
                  svg.selectAll("bar")
                      .data(data)
                      .enter().append("rect")
                      .attr("height", 0)
                      .attr("y", height)
                      .transition().duration(3000)
                      .delay( function(d,i) { return i * 200; })
                      .attr("class", "bar")
                      .attr("x", function(d) { return x(d.Label)+5; })
                      .attr("width", x.rangeBand())
                      .attr("y", function(d) { return y(d.Number); })
                      .attr("height", function(d) { return height - y(d.Number); });
            }
                            
            scope.$watch('data',function(){
                if(element[0].querySelector('svg')){
                    element[0].querySelector('svg').remove();
                }
                if(scope.data)
                    inits2(scope.data);
            })

        }
    };
    return directiveDefinitionObject;
})