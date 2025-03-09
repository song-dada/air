import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { khaiVFunc  } from "../../khaiVfunc";

import './linechart.scss';

interface DataPoint {
  name: string;
  date: string;
  value: number;
}

interface Props {
  onPm10: { dataTime: string; pm10Value: number }[];
  onPm25: { dataTime: string; pm25Value: number }[];
}
const LineChart = (props: Props) => {
  
  const svgRef = useRef<SVGSVGElement>(null);
  const [pm10Data, setPm10Data] = useState<DataPoint[]>([]);
  const [pm25Data, setPm25Data] = useState<DataPoint[]>([]);

  useEffect(() => {
    // 미세먼지
    if(props.onPm10?.length>0){
      let list: any[]=[];
      for (let i = 0; i < props.onPm10.length; i++) {
        const val = khaiVFunc("pm10Value", props.onPm10[i]["pm10Value"]);
        let insertV = {
          name: "pm10Value",
          date: props.onPm10[i]["dataTime"],
          value : val?.original
        }
        list.push( insertV )
      }
      setPm10Data(list);
    }

    // 초미세먼지
      if(props.onPm25?.length>0){
        let list: any[]=[];
        for (let i = 0; i < props.onPm25.length; i++) {
          const val = khaiVFunc("pm25Value", props.onPm25[i]["pm25Value"]);
          if( val?.value === null ){ continue; }
          let insertV = {
            name: "pm25Value",
            date: props.onPm25[i]["dataTime"],
            value : val?.original
          }
          list.push( insertV );
        }
        setPm25Data(list);
      }
    }, [props]);

  useEffect(() => {

  let datas=[...pm10Data,...pm25Data];
  
  if (!svgRef.current) return;

  const width = 510;
  const height = 300;
  const margin = { top: 20, right: 40, bottom: 40, left: 30 };

  const parseDate = d3.timeParse("%Y-%m-%d");  // 날짜 변환기 추가

  // X축 범위 설정
  const minX = d3.min(datas, d => parseDate(d.date))!;
  const maxX = d3.max(datas, d => parseDate(d.date))!;

  const xScale = d3.scaleTime()
    .domain([new Date(minX), new Date(maxX) ]) // 날짜 고정
    .range([10, (width - margin.right - margin.left)]);

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
      svg.append("g")
        .attr("transform", `translate(${margin.left} ,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale)
        .tickValues(pm10Data.map(d => parseDate(d.date)).filter(Boolean) as Date[])  // ✅ `null` 제거
          // .tickValues(pm10Data.map(d => parseDate(d.date)))  // ✅ X축 눈금 강제 설정
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
      .attr("stroke", "#3F8EF5")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator(pm10Data))
      .attr('transform', `translate(${margin.left},0) `);

    // PM25 (빨간 선)
    svg.append("path")
      .datum(pm25Data)
      .attr("fill", "none")
      .attr("stroke", "#FF595E")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator(pm25Data))
      .attr('transform', `translate(${margin.left},0) `);

      // 값 표시 (미세먼지 라인)
    svg.selectAll(".pm10-label")
      .data(pm10Data)
      .enter()
      .append("text")
      .attr("class", "pm10-label")
      .attr("x", d => xScale(parseDate(d.date)!)!)  // 날짜 추가
      .attr("y", d => yScale(d.value)! - 10)  // 기존 값 유지
      .text(d => d.value)  // pm10Value 대신 value 사용
      .attr("font-size", "12px")
      .attr("fill", "blue")
      .attr("text-anchor", "middle")
      .attr('transform', `translate(${margin.left},0) `);


    // 값 표시 (초미세먼지 라인)
    svg.selectAll(".pm25-label")
      .data(pm25Data)
      .enter()
      .append("text")
      .attr("class", "pm25-label")
      .attr("x", d => xScale(parseDate(d.date)!)!)  // 날짜 파싱 추가
      .attr("y", d => yScale(d.value)! - 10)
      .text(d => d.value)  // pm25Value 대신 value 사용
      .attr("font-size", "12px")
      .attr("fill", "red")
      .attr("text-anchor", "middle")
      .attr('transform', `translate(${margin.left},0)`);

      type DataType = { name: string; value: number; color?: string };

      const data: DataType[] = [
        { name: "미세먼지", value: 30, color: "#3F8EF5" },
        { name: "초미세먼지", value: 28, color: "#FF595E" }
      ];
      const legend = svg.append("g")
        .attr("transform", `translate(${width / 2 + 130 }, ${height / 50})`) 
        .selectAll("g")
        .data(data )
        .join("g")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`); // 범례 간격 설정
          // 색상 박스 추가
        legend.append("rect")
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", (d) => d.color as string);

          // 범례 텍스트 추가
        legend.append("text")
          .selectAll("tspan")
          .data(d => d.name.split(" ")) // 띄어쓰기 기준으로 줄바꿈
          .enter()
          .append("tspan")
          .attr("x", 20)
          .attr("y", 0)
          .attr("dy", "1em") // 줄 간격 조정
          .text((d: any) => d)
          .attr("font-size", "12px")
          .attr("fill", "#333");

  }, [pm10Data, pm25Data]);

  return <svg ref={svgRef}></svg>;
}

export default LineChart;
