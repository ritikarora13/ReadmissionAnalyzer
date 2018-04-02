var dat2; //just pasted
var dat3;
var gender_chart,age_chart,race_chart,readm_chart;
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function handledata(dat2)
{
    //xvalues=[0,1,2,3];
    //yvalues=[5,2,2,6];
    
    xvalues=[];
    yvalues=[];
        for(i = 0; i < dat2.length; i++){
        //html += "<tr>";
        if(i==0)continue;
        counter=0;
        for(j = 0; j < dat2[i].length; j++){
            if(counter==0)
              xvalues.push(dat2[i][j]);
            if(counter==1)
              yvalues.push(dat2[i][j])
            //html +="<td>"+dat2[i][j]+"</td>";

            if(dat2[i][j].trim() == ""){
                //empty += "cell "+i+" "+j+" is empty";
                //empty += "<br />";
            }
            counter=counter+1;
        }
      
        //html += "</tr>";
    }
    return [xvalues,yvalues];
}


function drawtimechart(x,y)
{
    //alert("NCSV Changed")
const tsctx = document.getElementById('chart2').getContext('2d');
const tsdata = {
    // Labels should be Date objects
    //labels: [new Date(2017, 08, 16), new Date(2017, 08, 17), new Date(2017, 08, 18)],
    labels:x,
    datasets: [{
        fill: false,
        label: 'Readmissions',
        //data: [280, 250, 340],
        data:y,
        borderColor: '#fe8b36',
        backgroundColor: '#fe8b36',
        lineTension: 0,
    }]
}
const options = {
    type: 'line',
    data: tsdata,
    options: {
        fill: false,
        responsive: true,
        scales: {
            xAxes: [{
                type: 'time',
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: "Date",
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                },
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: "Readmissions",
                }
            }]
        }
    }
}
const chart = new Chart(tsctx, options);


}
function convert_time_adm_age(results,p_year)
{
    var months={};
    /*year=parseInt(start_year);
    end_year=parseInt(end_year);
    */
    //for each month, it stores a vector for each age category
    for (m=0;m<=11;m+=1)
    {
        
        months[m]=[0,0,0,0,0,0,0,0,0,0];
        
    }
        var ages=['[0-10)',
    '[10-20)',
    '[20-30)',
    '[30-40)',
    '[40-50)',
    '[50-60)',
    '[60-70)',
    '[70-80)',
    '[80-90)',
    '[90-100)'];
    results=results['diabetes_data']; 
// console.log(JSON.stringify(months));
    for (var enc in results)
    {
        encounter=results[enc];
        if(encounter.readmission_result=="Yes")
        {
            
            p_age=encounter.age;
            date=new Date(encounter.admission_date);
            // alert("date is " + dateD)
            newdate=date.getMonth();
            
            months[newdate][ages.indexOf(p_age)]+=1
        }
    }
    //console.log(years['1999'])
    return [ages,months];
      
}
function convert_time_adm_gender(results)
{
    var time_admissions={};
    var males={};
    var females={};
    var femtime={};
    var mtime={};
   
    p_year=String($('#yearfilter').val());

    results=results['diabetes_data'];
 
    for (var m=0;m<12;m++)
    {
        females[m]=0;
        males[m]=0;
        time_admissions[m]=0;

    }
    
    for(var enc in results)
    {
        encounter=results[enc];
        //date=encounter.admission_date.split("/");
        if(encounter.readmission_result=="Yes"){
            
            //console.log(encounter.admission_date);
            date=new Date(String(encounter.admission_date));
            newdate=date.getMonth();
            //newdate=month[date.getMonth()]+" "+date.getFullYear();
            /*if (newdate in time_admissions )
            {*/
                if(encounter.gender=="Female")
                {
                    females[newdate]+=1;
                }
                    
                if(encounter.gender=="Male")males[newdate]+=1;

        }
            
    }
    //console.log(Object.keys(time_admissions).length)
    return [time_admissions,females,males];

}

function drawchart1(data,type)
{
        var times=[];
        var mal_adms=[];
        var fem_adms=[];

        coords=convert_time_adm_gender(data);
        //console.log(coords['2002'])
        for(var m=0;m<12;m++)
            times.push(monthNames[m]);
        //var times=Object.keys(coords[0]);
        var males=coords[2];
        var females=coords[1];
                console.log("inside drawchart1 males is "+String(males))

        for (var t=0;t<12;t++)
        {
            //x.push(times[t]);
            //console.log("X is=>"+t+"\t Y=>"+coords[t]);
            mal_adms.push(males[t]);
            fem_adms.push(females[t])
        }
        console.log(type + " drawchart 1");
        drawtime_adm_genderchart(times,mal_adms,fem_adms,null,type);
}

function drawchart2(data,type)
{
    p_year=$("#yearfilter").val();
    coords=convert_time_adm_age(data,p_year);
    var ages=coords[0];
    var month_matrix=coords[1];
    var datasets=[]; //yvalues
    //mlist=Object.keys(month_mat)
    var mcount=0;
    for (m in month_matrix)
    {
        
        color=getRandomColor();
        datasets.push({

        fill: false,
        label: monthNames[mcount],   //xvalues
        //data: [280, 250, 340],
        data:month_matrix[m],   
        borderColor: color,
        backgroundColor: color,
        lineTension: 0,
    });
        mcount+=1;
    }
    //alert("stopper5")

    drawage_time(ages,datasets,'month',type)

    //month_matrix contains an array for each month
    //And each of these arrays is a 10 dim vector for age categories denoting the frequency of admissions for each admission in that month in that age category..
}

function drawage_time(age_categories,yvalues,timescale,type)
{
    timescale=timescale||'month';
    p_year=$("#yearfilter").val();
    /*if(timescale=='year')
    {
        dayparam='YYYY';
    }
    else
    {
        dayparam='MMM';

    }*/
    const tsctx = document.getElementById('chart1').getContext('2d');
    const tsdata = {
    labels:age_categories,
    datasets: yvalues,
                    }
const options = {
    type: 'line',
    data: tsdata,
    options: {
        fill: false,
        responsive: true,
        scales: {
            xAxes: [{
                /*type: 'time',
                time: {
                        unit: timescale,
                        round: timescale,
                        displayFormats: {
                          day: dayparam
                        }
                      }*/
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: timescale,
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                },
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: "Readmissions of  different genders in "+p_year,
                }
            }]
        }
    }
    }
    if (type === 'old') {
            console.log(type);
            age_chart.destroy();
        }
     age_chart = new Chart(tsctx, options);
}
function drawtime_adm_genderchart(times,males,females,timescale,type)
{
    timescale=timescale||'month';
    if(timescale=='year')
    {
        dayparam='YYYY';
    }
    else
    {
        dayparam='MMM';

    }
    
    console.log(String(males))
    const tsctx = document.getElementById('chart2').getContext('2d');
    const tsdata = {
    // Labels should be Date objects
    //labels: [new Date(2017, 08, 16), new Date(2017, 08, 17), new Date(2017, 08, 18)],

    //labels attribute takes a list of dates only if chart type is time....

    labels:times,
    datasets: [{
        fill: false,
        label: 'Male Admissions',
        //data: [280, 250, 340],
        data:males,
        borderColor: '#fe8b36',
        backgroundColor: '#fe8b36',
        lineTension: 0,
    },
    {
        fill: false,
        label: 'Female Admissions',
        //data: [280, 250, 340],
        data:females,
        borderColor: '#212bb2',
        backgroundColor: '#212bb2',
        lineTension: 0,
    }]
}
const options = {
    type: 'bar',
    data: tsdata,
    options: {
        fill: false,
        responsive: true,
        scales: {
            xAxes: [{
                ticks:{
                    beginAtZero:true,
                },
          //       type: 'time',
          //       time: {
          //   unit: timescale,
          //   round: timescale,
          //   displayFormats: {
          //     day: dayparam;
          //   }
          // },
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: timescale,
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                },
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: "Readmissions of  different genders over time",
                }
            }]
        }
    }
}
        
        if (type === 'old') 
        {
            console.log(type);
            gender_chart.destroy();
        }
        gender_chart = new Chart(tsctx, options);

}

function drawchart3(results,type)
{
    results=results['diabetes_data'];
    labels=['Hispanic','Asian','Caucasian','AfricanAmerican','Other']
    //ethgroups={'Hispanic':0,'Asian':0,'Caucasian':0,'AfricanAmerican':0};
    ethgroups=[0,0,0,0,0];
    for(var enc in results)
    {
        encounter=results[enc];
        // console.log(results[enc].race)
        if(encounter.readmission_result=="Yes")
        {
            if(labels.indexOf(results[enc].race)>=0)
            {
                // console.log(labels.indexOf(results[enc].race))
                ethgroups[labels.indexOf(results[enc].race)]+=1;
            }
        }
    }
    
    drawpiechart(labels,ethgroups,type);

}
function drawpiechart(labels,ethgroups,type)
{
    const tsctx = document.getElementById('chart3').getContext('2d');
    config = {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: ethgroups,
                    backgroundColor: [
                        "rgb(233, 30, 99)",
                        "rgb(255, 193, 7)",
                        "rgb(0, 188, 212)",
                        "rgb(139, 195, 74)",
                        "#9E9E9E"
                    ],
                    label: 'Ehtinic groups',
                }],
                labels: labels
            },
            options: {
                responsive: true,
                // legend: true,
            }
        }
        if (type === 'old') {
            console.log(type);
            race_chart.destroy();
        }
    race_chart = new Chart(tsctx, config);

}




function convert_time_adm_readm(results)
{
    var time_admissions={};
    var totalAdmissions={};
    var readmissions={};
   
    p_year=String($('#yearfilter').val());

    results=results['diabetes_data'];
 
    for (var m=0;m<12;m++)
    {
        totalAdmissions[m]=0;
        readmissions[m]=0;
        time_admissions[m]=0;

    }
    
    for(var enc in results)
    {
        encounter=results[enc];
        date=new Date(String(encounter.admission_date));
        newdate=date.getMonth();

        if(encounter.readmission_result=="Yes") {
            readmissions[newdate]+=1;
        }
        totalAdmissions[newdate]+=1;
            
    }
    //console.log(Object.keys(time_admissions).length)
    return [time_admissions,totalAdmissions,readmissions];

}

function drawtime_adm_readmchart(times,readmission,total_adms,timescale,type)
{
    timescale=timescale||'month';
    if(timescale=='year')
    {
        dayparam='YYYY';
    }
    else
    {
        dayparam='MMM';

    }
    
    console.log(String(readmission))
    const tsctx = document.getElementById('chart5').getContext('2d');
    const tsdata = {
    // Labels should be Date objects
    //labels: [new Date(2017, 08, 16), new Date(2017, 08, 17), new Date(2017, 08, 18)],

    //labels attribute takes a list of dates only if chart type is time....

        labels:times,
        datasets: [{
            fill: false,
            label: 'Readmissions',
            //data: [280, 250, 340],
            data:readmission,
            borderColor: '#fe8b36',
            backgroundColor: '#fe8b36',
            lineTension: 0,
        },
        {
            fill: false,
            label: 'Total Admissions',
            //data: [280, 250, 340],
            data:total_adms,
            borderColor: '#212bb2',
            backgroundColor: '#212bb2',
            lineTension: 0,
        }]
    }
    const options = {
        type: 'bar',
        data: tsdata,
        options: {
            fill: false,
            responsive: true,
            scales: {
                xAxes: [{
                    ticks:{
                        beginAtZero:true,
                    },
              //       type: 'time',
              //       time: {
              //   unit: timescale,
              //   round: timescale,
              //   displayFormats: {
              //     day: dayparam;
              //   }
              // },
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: timescale,
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                    },
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: "Total admissions and Readmissions for each month",
                    }
                }]
            }
        }
    }
    
    if (type === 'old') 
    {
        console.log(type);
        readm_chart.destroy();
    }
    readm_chart = new Chart(tsctx, options);

}

function drawchart5(data,type)
{
        var times=[];
        var readmission=[];
        var total_adms=[];

        coords=convert_time_adm_readm(data);
        //console.log(coords['2002'])
        for(var m=0;m<12;m++)
            times.push(monthNames[m]);
        //var times=Object.keys(coords[0]);
        var readmissionList=coords[2];
        var total_admsList=coords[1];
                // console.log("inside drawchart1 males is "+String(males))

        for (var t=0;t<12;t++)
        {
            //x.push(times[t]);
            //console.log("X is=>"+t+"\t Y=>"+coords[t]);
            readmission.push(readmissionList[t]);
            total_adms.push(total_admsList[t])
        }
        console.log(type + " drawchart 5");
        drawtime_adm_readmchart(times,readmission,total_adms,null,type);
}


function convert_time_lacescore(results)
{
    var time_admissions={};
    var laceScore={'Low' : {}, 'Medium' : {}, 'High' : {}};
   
    p_year=String($('#yearfilter').val());

    results=results['diabetes_data'];
 
    for (var m=0;m<12;m++)
    {
        laceScore['Low'][m]=0;
        laceScore['Medium'][m]=0;
        laceScore['High'][m]=0;
        time_admissions[m]=0;

    }
    
    for(var enc in results)
    {
        encounter=results[enc];
        date=new Date(String(encounter.admission_date));
        newdate=date.getMonth();

        if(encounter.risk_of_readmission=="Low") {
            laceScore['Low'][newdate]+=1; 
        } else if (encounter.risk_of_readmission=="Medium") {
            laceScore['Medium'][newdate]+=1;
        } else {
            laceScore['High'][newdate]+=1;    
        }
        
            
    }
    //console.log(Object.keys(time_admissions).length)
    return laceScore;

}

function drawtime_adm_lacescore(times,laceScore,timescale,type)
{
    timescale=timescale||'month';
    if(timescale=='year')
    {
        dayparam='YYYY';
    }
    else
    {
        dayparam='MMM';

    }
    
    console.log(JSON.stringify(laceScore))
    const tsctx = document.getElementById('chart6').getContext('2d');
    const tsdata = {
    // Labels should be Date objects
    //labels: [new Date(2017, 08, 16), new Date(2017, 08, 17), new Date(2017, 08, 18)],

    //labels attribute takes a list of dates only if chart type is time....

        labels:times,
        datasets: [{
            fill: false,
            label: 'Low (0-6)',
            //data: [280, 250, 340],
            data:laceScore['Low'],
            borderColor: '#4CAF50',
            backgroundColor: '#4CAF50',
            lineTension: 0,
        },
        {
            fill: false,
            label: 'Medium (7-9)',
            //data: [280, 250, 340],
            data:laceScore['Medium'],
            borderColor: '#FFC107',
            backgroundColor: '#FFC107',
            lineTension: 0,
        },
        {
            fill: false,
            label: 'High (10+)',
            //data: [280, 250, 340],
            data:laceScore['High'],
            borderColor: '#F44336',
            backgroundColor: '#F44336',
            lineTension: 0,
        }]
    }
    const options = {
        type: 'bar',
        data: tsdata,
        options: {
            fill: false,
            responsive: true,
            scales: {
                xAxes: [{
                    ticks:{
                        beginAtZero:true,
                    },
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: timescale,
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                    },
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: "Total admissions and Readmissions for each month",
                    }
                }]
            }
        }
    }
    
    if (type === 'old') 
    {
        console.log(type);
        readm_chart.destroy();
    }
    readm_chart = new Chart(tsctx, options);

}

function drawchart6(data,type)
{
        var times=[];
        var laceScore = {'Low':[], 'Medium':[], 'High':[]};
        var total_adms = [];
            console.log(type + " drawchart 6");
        laceList=convert_time_lacescore(data);
        console.log(laceList)
        for(var m=0;m<12;m++)
            times.push(monthNames[m]);
        //var times=Object.keys(coords[0]);
        var readmissionList=coords[2];
        var total_admsList=coords[1];
                // console.log("inside drawchart1 males is "+String(males))

        for (var t=0;t<12;t++)
        {
            //x.push(times[t]);
            //console.log("X is=>"+t+"\t Y=>"+coords[t]);
            laceScore['Low'].push(laceList['Low'][t]);
            laceScore['Medium'].push(laceList['Medium'][t]);
            laceScore['High'].push(laceList['High'][t]);
            
        }
        
        drawtime_adm_lacescore(times,laceScore,null,type);
}



function convert_time_adm_avgtime(results)
{
    var time_admissions={};
    var adms = {};
    var avgTime = {};
   
    p_year=String($('#yearfilter').val());

    results=results['diabetes_data'];
 
    for (var m=0;m<12;m++)
    {
        adms[m]=0;
        avgTime[m]=0;
        time_admissions[m]=0;

    }
    
    for(var enc in results)
    {
        encounter=results[enc];
        date=new Date(String(encounter.admission_date));
        newdate=date.getMonth();

        adms[newdate] += 1;
        avgTime[newdate] += encounter.time_in_hospital;
            
    }

    console.log("Avg time before" + JSON.stringify(avgTime))
    for (var i=0;i<12;i++) {
        avgTime[i] = avgTime[i] / adms[i];
    }
    console.log("Adm count - " + JSON.stringify(adms))
    console.log("Avg time After" + JSON.stringify(avgTime))
    return [adms, avgTime];

}

function drawtime_adm_avgtime(times, adms, avgTimes, timescale, type)
{
    timescale=timescale||'month';
    if(timescale=='year')
    {
        dayparam='YYYY';
    }
    else
    {
        dayparam='MMM';

    }
    console.log('FInal adms count - ' + JSON.stringify(adms))
    console.log('FInal Avg time count - ' + JSON.stringify(avgTimes))
    
    const tsctx = document.getElementById('chart7').getContext('2d');
    const tsdata = {
    // Labels should be Date objects
    //labels: [new Date(2017, 08, 16), new Date(2017, 08, 17), new Date(2017, 08, 18)],

    //labels attribute takes a list of dates only if chart type is time....

        labels:times,
        datasets: [{
            fill: false,
            type: 'bar',
            label: 'Total Admissions',
            //data: [280, 250, 340],
            data:adms,
            borderColor: '#fe8b36',
            backgroundColor: '#fe8b36',
            lineTension: 0,
            yAxisID: 'y-axis-1',
        },
        {
            fill: false,
            type: 'line',
            label: 'Avg time',
            //data: [280, 250, 340],
            data:avgTimes,
            borderColor: '#212bb2',
            backgroundColor: '#212bb2',
            lineTension: 0,
            yAxisID: 'y-axis-2',
        }]
        
    }
    const options = {
        type: 'bar',
        data: tsdata,
        options: {
            fill: false,
            responsive: true,
            scales: {
                xAxes: [{
                    ticks:{
                        beginAtZero:true,
                    },
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: timescale,
                    }
                }],
                yAxes: [{
                    // type: 'linear',
                    ticks: {
                        beginAtZero: true,
                    },
                    display: true,
                    position: 'left',
                    id: 'y-axis-1',
                    scaleLabel: {
                        display: true,
                        labelString: "Total admissions",
                    }
                },{
                    // type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    ticks: {
                        beginAtZero: true,
                    },
                    display: true,
                    position: 'right',
                    id: 'y-axis-2',

                    // grid line settings
                    gridLines: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Avg time spent in hospital in days",
                    }
                }]
            }
        }
    }
    
    if (type === 'old') 
    {
        console.log(type);
        readm_chart.destroy();
    }
    readm_chart = new Chart(tsctx, options);

}

function drawchart7(data,type)
{
        var times=[];
        var admCount=[];
        var avgTimeCount = [];
            console.log(type + " drawchart 7");
        mixLabels=convert_time_adm_avgtime(data);
        
        for(var m=0;m<12;m++)
            times.push(monthNames[m]);
        //var times=Object.keys(coords[0]);
        var totalAdms=mixLabels[0];
        var avgTime=mixLabels[1];
                // console.log("inside drawchart1 males is "+String(males))

        for (var t=0;t<12;t++)
        {
            //x.push(times[t]);
            //console.log("X is=>"+t+"\t Y=>"+coords[t]);
            admCount.push(totalAdms[t]);
            avgTimeCount.push(avgTime[t]);
            
        }
        
        drawtime_adm_avgtime(times,admCount,avgTimeCount,null,type);
}

function convert_time_admtype(results)
{
    var time_admissions={};
    var admTypes={'Urgent':{}, 'Elective':{}, 'Emergency':{}};
   
    p_year=String($('#yearfilter').val());

    results=results['diabetes_data'];
 
    for (var m=0;m<12;m++)
    {
        admTypes['Urgent'][m]=0;
        admTypes['Elective'][m]=0;
        admTypes['Emergency'][m]=0;
        time_admissions[m]=0;

    }
    
    for(var enc in results)
    {
        encounter=results[enc];
        if (encounter.readmission_result=="Yes") {
            date=new Date(String(encounter.admission_date));
            newdate=date.getMonth();

            if(encounter.admission_type=="Urgent") {
                admTypes['Urgent'][newdate]+=1; 
            } else if (encounter.admission_type=="Elective") {
                admTypes['Elective'][newdate]+=1;
            } else if (encounter.admission_type=="Emergency") {
                admTypes['Emergency'][newdate]+=1;    
            }
        }
    }
    //console.log(Object.keys(time_admissions).length)
    return admTypes;

}

function drawtime_adm_type(times,admTypes,timescale,type)
{
    timescale=timescale||'month';
    if(timescale=='year')
    {
        dayparam='YYYY';
    }
    else
    {
        dayparam='MMM';

    }
    
    console.log(JSON.stringify(admTypes))
    const tsctx = document.getElementById('chart8').getContext('2d');
    const tsdata = {
    // Labels should be Date objects
    //labels: [new Date(2017, 08, 16), new Date(2017, 08, 17), new Date(2017, 08, 18)],

    //labels attribute takes a list of dates only if chart type is time....

        labels:times,
        datasets: [{
            fill: false,
            label: 'Urgent',
            //data: [280, 250, 340],
            data:admTypes['Urgent'],
            borderColor: '#3F51B5',
            backgroundColor: '#3F51B5',
            lineTension: 0,
        },
        {
            fill: false,
            label: 'Elective',
            //data: [280, 250, 340],
            data:admTypes['Elective'],
            borderColor: '#795548',
            backgroundColor: '#795548',
            lineTension: 0,
        },
        {
            fill: false,
            label: 'Emergency',
            //data: [280, 250, 340],
            data:admTypes['Emergency'],
            borderColor: '#FF5722',
            backgroundColor: '#FF5722',
            lineTension: 0,
        }]
    }
    const options = {
        type: 'bar',
        data: tsdata,
        options: {
            fill: false,
            responsive: true,
            scales: {
                xAxes: [{
                    ticks:{
                        beginAtZero:true,
                    },
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: timescale,
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                    },
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: "Total admission count by admission type",
                    }
                }]
            }
        }
    }
    
    if (type === 'old') 
    {
        console.log(type);
        readm_chart.destroy();
    }
    readm_chart = new Chart(tsctx, options);

}

function drawchart8(data,type)
{
        var times=[];
        var admTypes = {'Urgent':[], 'Elective':[], 'Emergency':[]};
        var total_adms = [];
            console.log(type + " drawchart 8");
        admTypeData=convert_time_admtype(data);
        
        for(var m=0;m<12;m++) {
            times.push(monthNames[m]);
        }
        

        for (var t=0;t<12;t++)
        {
            admTypes['Urgent'].push(admTypeData['Urgent'][t]);
            admTypes['Elective'].push(admTypeData['Elective'][t]);
            admTypes['Emergency'].push(admTypeData['Emergency'][t]);         
        }
        
        drawtime_adm_type(times,admTypes,null,type);
}

/*function convert_time_adm_lace(results)
{
    var time_admissions={};
    var males={};
    var females={};
    var femtime={};
    var mtime={};
    //var num_encounters=[];
    results=results['diabetes_data'];
    //console.log(results['diabetes_data'].length)
    for(var enc in results)
    {
        //date=encounter.admission_date.split("/");
        encounter=results[enc];
        //console.log(encounter.admission_date);
        date=new Date(new String(encounter.admission_date));
        newdate=date.getFullYear();
        females[newdate]=0;
        males[newdate]=0;
        time_admissions[newdate]=0;

    }
    for(var enc in results)
    {
        //date=encounter.admission_date.split("/");
        encounter=results[enc];
        //console.log(encounter.admission_date);
        date=new Date(new String(encounter.admission_date));
        newdate=date.getFullYear();
        
  
        if(encounter.readmission_result=="Yes")
        {
            if(encounter.gender=="Female")
            {
                females[newdate]+=1;
            }
                
            if(encounter.gender=="Male")males[newdate]+=1;
        }
            
                
            
    }
    //console.log(Object.keys(time_admissions).length)
    return [time_admissions,females,males];

}
*/
// function drawchart4(data)
// {
//     coords=convert_time_adm_lace(data);
//     var lacescores=coords[0];
//     var year_mat=coords[1];
//     var datasets=[];
//     years=Object.keys(year_mat)
//     for (y in years)
//     {
//         year=years[y];
//         color=getRandomColor();
//         datasets.push({
//         fill: false,
//         label: year,
//         //data: [280, 250, 340],
//         data:year_mat[year],
//         borderColor: color,
//         backgroundColor: color,
//         lineTension: 0,
//     });
//     }
//     //alert("stopper5")

//     drawage_time(ages,datasets)

// }


function demo_dataplotter(type)
{

    var yearfilter=new Date($("#yearfilter").val()).getFullYear();
  
    $.ajax({
    type: "GET",
    url: "/patientlist",
    dataType: "json",
    data:{filter_year:yearfilter},
    success: function(data) {
        
        drawchart1(data, type); // Draw gender chart
        drawchart2(data, type);
        drawchart3(data, type);
        //drawchart4(data);
        drawchart5(data, type);
        drawchart6(data, type);
        drawchart7(data, type);
        drawchart8(data, type);
    },
    error: function(err){
        console.log(err);
    },});
}







