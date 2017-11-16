<template>
    <div class="root">
        <div id="container"></div>
        <div id="sliders">
            <table>
                <tr>
                    <td>α 角（内旋转角）</td>
                    <td><input id="alpha" type="range" min="0" max="45" value="15"/> <span id="alpha-value" class="value"></span></td>
                </tr>
                <tr>
                    <td>β 角（外旋转角）</td>
                    <td><input id="beta" type="range" min="-45" max="45" value="15"/> <span id="beta-value" class="value"></span></td>
                </tr>
                <tr>
                    <td>深度</td>
                    <td><input id="depth" type="range" min="20" max="100" value="50"/> <span id="depth-value" class="value"></span></td>
                </tr>
            </table>
        </div>

    </div>
</template>
<script>
    import $ from 'jquery'
    import Highcharts from 'highcharts/highstock';
    import HighchartsMore from 'highcharts/highcharts-more';
    import HighchartsDrilldown from 'highcharts/modules/drilldown';
    import Highcharts3D from 'highcharts/highcharts-3d';
    HighchartsMore(Highcharts)
    HighchartsDrilldown(Highcharts);
    Highcharts3D(Highcharts);
    export default {
        name:'highcharts',
        props:['options'],
        data(){
            return{
                
            }
        },
        mounted(){
             // Set up the chart
            this.drow_line({
                data:this.options
            });
        },
        methods:{
            drow_line(opt) {
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'container',
                        type: 'column',
                        options3d: {
                            enabled: true,
                            alpha: 15,
                            beta: 15,
                            depth: 50,
                            viewDistance: 25
                        }
                    },
                    title: {
                        text: '交互性3D柱状图'
                    },
                    subtitle: {
                        text: '可通过滑动下方滑块测试'
                    },
                    plotOptions: {
                        column: {
                            depth: 25
                        }
                    },
                    series: [{
                        name: '图例1',
                        data: opt.data
                    }]
                });
                function showValues() {
                    $('#alpha-value').html(chart.options.chart.options3d.alpha);
                    $('#beta-value').html(chart.options.chart.options3d.beta);
                    $('#depth-value').html(chart.options.chart.options3d.depth);
                }
                // Activate the sliders
                $('#sliders input').on('input change', function () {
                    chart.options.chart.options3d[this.id] = this.value;
                    showValues();
                    chart.redraw(false);
                });
                showValues();
            }
        }
    }
</script>
<style scoped>

</style>