var dat2;
var dat3;
var gender_chart;
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
        m+=1;
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

    for (var enc in results)
    {
        encounter=results[enc];
        p_age=encounter.age;
        date=new Date(new String(encounter.admission_date));
        newdate=parseInt(date.getMonth());
        
        //alert("stopper")
        months[newdate][ages.indexOf(p_age)]+=1
        
    }
    //console.log(years['1999'])
    return [ages,months]
      
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
    /*for (var ctr=0;i<12;i+=1)
    {
        males[(month[i]+" "+p_year)]=0;
        females[(month[i]+" "+p_year)]=0;
    }*/
    //console.log(results['diabetes_data'].length)

    for (var m=0;m<12;m++)
    {
        females[m]=0;
        males[m]=0;
        time_admissions[m]=0;

    }
    // for(var enc in results)
    // {
    //     //date=encounter.admission_date.split("/");
    //     encounter=results[enc];
    //     //console.log(encounter.admission_date);
    //     date=new Date(String(encounter.admission_date));
    //     newdate=date;
    //     //newdate=month[date.getMonth()]+" "+date.getFullYear();
    //     females[newdate]=0;
    //     males[newdate]=0;
    //     time_admissions[newdate]=0;

    // }
    for(var enc in results)
    {
        //date=encounter.admission_date.split("/");
        encounter=results[enc];
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
        //}
        //else
        //{

        //}
        
            
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
function drawchart2(data)
{
    p_year=$("#yearfilter").val();
    coords=convert_time_adm_age(data,p_year);
    var ages=coords[0];
    var month_mat=coords[1];
    var datasets=[];
    //mlist=Object.keys(month_mat)
    for (m=0;m<12;m+=1)
    {
        month_adms=month_mat[m];
        color=getRandomColor();
        datasets.push({

        fill: false,
        label: monthNames[m],
        //data: [280, 250, 340],
        data:month_adms,
        borderColor: color,
        backgroundColor: color,
        lineTension: 0,
    });
    }
    //alert("stopper5")

    drawage_time(ages,datasets)

    //years contains an array for each year between start and end date. 
    //And each of these arrays is a 10 dim vector for age categories denoting the frequency of admissions for each admission in that year in that age category..
}

function drawage_time(age_categories,yvalues,timescale)
{
    timescale=timescale||'month';
    p_year=$("#yearfilter").val();
    if(timescale=='year')
    {
        dayparam='YYYY';
    }
    else
    {
        dayparam='MMM';

    }
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
                type: 'time',
                time: {
                        unit: timescale,
                        round: timescale,
                        displayFormats: {
                          day: dayparam
                        }
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
                    labelString: "Readmissions of  different genders in "+p_year,
                }
            }]
        }
    }
}
const age_chart = new Chart(tsctx, options);


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
    //console.log('Times x axis variable in drawtime_adm_genderchart is'+JSON.stringify(times))
    console.log(String(males))
    const tsctx = document.getElementById('chart2').getContext('2d');
    const tsdata = {
    // Labels should be Date objects
    //labels: [new Date(2017, 08, 16), new Date(2017, 08, 17), new Date(2017, 08, 18)],

    //this is where the error is... labels attribute takes a list of dates only....

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
        console.log(type + 'inside drawtime');
        if (type === 'old') {
            console.log(type);
            gender_chart.destroy();
        }
        gender_chart = new Chart(tsctx, options);

}

function drawchart3(results)
{
    results=results['diabetes_data'];
    labels=['Hispanic','Asian','Caucasian','AfricanAmerican','Other']
    //ethgroups={'Hispanic':0,'Asian':0,'Caucasian':0,'AfricanAmerican':0};
    ethgroups=[0,0,0,0,0];
    for(var enc in results)
    {
        console.log(results[enc].race)
        if(labels.indexOf(results[enc].race)>=0)
        {
            console.log(labels.indexOf(results[enc].race))
            ethgroups[labels.indexOf(results[enc].race)]+=1;
        }
    }
    console.log(JSON.stringify(ethgroups))
    drawpiechart(labels,ethgroups);

}
function drawpiechart(labels,ethgroups)
{
    const tsctx = document.getElementById('chart3').getContext('2d');
    config = {
            type: 'pie',
            data: {
                datasets: [{
                    data: ethgroups,
                    backgroundColor: [
                        "rgb(233, 30, 99)",
                        "rgb(255, 193, 7)",
                        "rgb(0, 188, 212)",
                        "rgb(139, 195, 74)"
                    ],
                }],
                labels: labels
            },
            options: {
                responsive: true,
                legend: true
            }
        }
const chart3 = new Chart(tsctx, config);

}


function convert_time_adm_lace(results)
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
        
        /*if (newdate in time_admissions )
        {*/
            if(encounter.gender=="Female")
            {
                females[newdate]+=1;
            }
                
            if(encounter.gender=="Male")males[newdate]+=1;
        //}
        //else
        //{

        //}
        
            
    }
    console.log(Object.keys(time_admissions).length)
    return [time_admissions,females,males];

}
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
    /*var dates={
        startdate:$("#filterdate1").val(),
        enddate:$("#filterdate2").val()
    };*/
    console.log(type + 'inside data plotter')
    var yearfilter=new Date($("#yearfilter").val()).getFullYear();
    //alert(dates.startdate);
    // /console.log(dates.enddate);
    $.ajax({
    type: "GET",
    url: "/patientlist",
    dataType: "json",
    data:{filter_year:yearfilter},
    success: function(data) {
        console.log("New Data")
        console.log(data);
        //dat2 = $.csv.toArrays(data);
        //coords=handledata(dat2);
        drawchart1(data, type);
        // drawchart2(data);
        // drawchart3(data);
        //drawchart4(data);
    },
    error: function(err){
        console.log(err);
    },});
}

/*function getData()
{
    $.ajax({
    type: "GET",
    url: "/ReadmissionAnalyzer/tes/testdata.csv",
    dataType: "text",
    success: function(data) {
        dat2 = $.csv.toArrays(data);
        coords=handledata(dat2);
        //coords=convert_time_admissions(coords);
        drawtimechart(coords[0],coords[1]);
    },
    error: function(err){
        console.log(err);
    },});
}

function tryutton()
{
    alert("I am here")
const tsctx = document.getElementById('time_series_chart').getContext('2d');
const tsdata = {
    // Labels should be Date objects
    labels: [new Date(2017, 08, 16), new Date(2017, 08, 17), new Date(2017, 08, 18)],
    datasets: [{
        fill: false,
        label: 'Readmissions',
        data: [280, 250, 340],
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
}*/