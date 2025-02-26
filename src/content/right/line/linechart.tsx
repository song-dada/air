import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { khaiVFunc  } from "../../khaiVfunc";

import './linechart.scss';

interface DataPoint {
  date: string;
  value: number;
}

interface Props {
  onPm10: { dataTime: string; pm10Value: number }[];
  onPm25: { dataTime: string; pm25Value: number }[];
}
function LineChart(props: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pm10Data, setPm10Data] = useState<DataPoint[]>([]);
  const [pm25Data, setPm25Data] = useState<DataPoint[]>([]);
  useEffect(() => {
        if(props.onPm10?.length>0){
          // console.log(props.onPm10)
          let list: any[]=[];
          for (let i = 0; i < props.onPm10.length; i++) {
            const val = khaiVFunc("pm10Value", props.onPm10[i]["pm10Value"]);
            let insertV = {
              date: props.onPm10[i]["dataTime"],
              value : val?.original
            }
            list.push( insertV )
          }
          // console.log(list);
          setPm10Data(list);
        }
    
        if(props.onPm25?.length>0){
        //  console.log(props.onPm25)
          let list: any[]=[];
          for (let i = 0; i < props.onPm25.length; i++) {
            const val = khaiVFunc("pm25Value", props.onPm25[i]["pm25Value"]);
            if( val?.value === null ){ continue; }
            let insertV = {
              date: props.onPm25[i]["dataTime"],
              value : val?.original
            }
            list.push( insertV );
          }
          setPm25Data(list);
        }
      }, [props]);



  useEffect(() => {
    // console.log(pm10Data)
    // console.log(pm25Data)

    let datas=[...pm10Data,...pm25Data];
    
    if (!svgRef.current) return;

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const parseDate = d3.timeParse("%Y-%m-%d");  // 날짜 변환기 추가

    const minX = datas[0]?.date;
    const maxX = datas[datas.length-1]?.date;
    // console.log(datas[0]?.date)

    const xScale = d3.scaleTime()
      .domain([new Date(minX), new Date(maxX)]) // 날짜 고정
      .range([margin.left, (width ) - margin.right - 100]);


    const yScale = d3.scaleLinear()
      .domain([0, 200]) // 지수 변환값 기준으로 y축을 설정함.
      .range([height - margin.bottom, margin.top]);

    // Line Generator 설정 // 선을 그리기 위한.. 무언가
    const lineGenerator = (data: DataPoint[]) =>
      d3.line<DataPoint>()
        .x((d) => xScale(parseDate(d.date)!))
        .y((d) => yScale(d.value))(data);

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // 기존 그래프 지우기
    svg.selectAll("*").remove();

    // X축 추가
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(7)
      .tickFormat(d => d3.timeFormat("%m-%d")(d as Date))
      );


    // Y축 추가
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // PM10 (파란 선)
    svg.append("path")
      .datum(pm10Data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator(pm10Data))
      .attr('transform', `translate(${margin.left +35},0) scale(0.83, 1)`);


    // PM25 (빨간 선)
    svg.append("path")
      .datum(pm25Data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator(pm25Data))
      .attr('transform', `translate(${margin.left + 35},0) scale(0.83, 1)`);
      
      console.log("xScale range:", xScale.range());
  }, [pm10Data, pm25Data]);

  return <svg ref={svgRef}></svg>;
}

export default LineChart;
