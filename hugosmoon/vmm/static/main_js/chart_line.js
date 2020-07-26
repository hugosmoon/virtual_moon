// 参数-div_ID,图表类型,线宽，大标题，x轴标题，y轴标题，x轴单位，y轴单位,是否显示x轴数字,是否显示y轴数字，是否显示x轴刻度，是否显示y轴刻度,是否显示x轴标题,是否显示y轴标题
function chart_line(container_id,chart_type,line_weight=1,line_color='#6cb041',title_chart,title_x,title_y,unit_x,unit_y,axisLabel_x=true,axisLabel_y=true,axisLabel_number_x_show=true,axisLabel_number_y_show=true,title_x_show=true,title_y_show=true){
    this.data=[];
    this.dom = document.getElementById(container_id);
    this.myChart = echarts.init(this.dom,chart_type);
    this.option = null;
    this.title_chart=title_chart;
    this.title_x=title_x;
    this.title_y=title_y;
    this.option = {
        backgroundColor:'transparent',
        title: {
            text: title_chart,
            // left:'0%',
         //    top:20
        },
        toolbox: {
            show: false,
            itemSiz:30,
            feature: {
                saveAsImage: {}
            }
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                params1 = params[0];
                // console.log(params1.data.name_x);
                return params1.data.name_x + ' : ' + params1.value[0]+unit_x+'  '+ params1.data.name_y + ' : ' + params1.value[1]+unit_y;
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: 'value',
            name: title_x_show?title_x+'/'+unit_x:'',
            nameLocation:'middle',  
            nameGap:25,
            nameTextStyle:{
                fontWeight:'bold'
            },
            splitLine: {
                show: true,
                lineStyle:{
                    width:0.3//设置线条粗细
                }
            },
            axisLabel:{
                show: axisLabel_x,
            }
        },
        yAxis: {
            type: 'value',
            name: title_y_show?title_y+'/'+unit_y:'',
            nameLocation:'end',
         //    nameGap:35,
            nameTextStyle:{
                fontWeight:'bold'
            },
            splitLine: {
                show: true,
                lineStyle:{
                    width:0.3//设置线条粗细
                }
            },
            axisLabel:{
                show: axisLabel_y,
            }
        },
        series: [{
            name: '切削力数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: this.data,
            itemStyle: {
                normal: {
                    color: line_color,
                    lineStyle:{
                        width:line_weight//设置线条粗细
                    }
                }
            }
        }]
    }

    this.push_data = function(x,y) {
        this.data.push({
            name: Math.random().toString(),
            name_x: this.title_x,
            name_y: this.title_y,
            value: [
                x,
                y]
        });
    }
    this.delete_data=function(){
       this.data.shift();  
    }

    this.update=function(){
        try {
             this.option.xAxis.min=this.data[0].value[0];
             this.option.xAxis.max=this.data[this.data.length-1].value[0];
        } catch (error) {
            
        }
         
         if (this.option && typeof this.option === "object") {
             this.myChart.setOption(this.option, true);
         }
    }

    
 }