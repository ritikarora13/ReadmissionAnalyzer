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
            borderColor: '#4CAF50',
            backgroundColor: '#4CAF50',
            lineTension: 0,
        },
        {
            fill: false,
            label: 'Elective',
            //data: [280, 250, 340],
            data:admTypes['Elective'],
            borderColor: '#FFC107',
            backgroundColor: '#FFC107',
            lineTension: 0,
        },
        {
            fill: false,
            label: 'Emergency',
            //data: [280, 250, 340],
            data:admTypes['Emergency'],
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