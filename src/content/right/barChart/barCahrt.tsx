import React, { useState, useEffect, useRef } from "react";
import './barChart.scss'
import * as d3 from "d3";

const BarChart = (props: any) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    
    useEffect(() => {
        const data = props.getTodayList;

        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = 510 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        d3.select(svgRef.current).selectAll("*").remove(); // 기존 그래프 초기화

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // X축 스케일 (수치 값)
        const x = d3.scaleLinear()
            .domain([0,200]) // 수정
            .range([0, width]);

        // Y축 스케일 (도시 이름)
        const y = d3.scaleBand()
            .domain(data.map((d:any) => d.name))
            .range([0, height])
            .padding(0.2);

        // 바 너비 설정
        const barHeight = y.bandwidth() / 3;

        type NewType = number;

        // PM10 막대 추가
        svg.selectAll(".bar-pm10")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar-pm10")
            .attr("x", 0)
            .attr("y", (d:any )=> (y(d.name) as NewType) +10)
            .attr("width", (d:any )=>  x(d.pm10Value))
            .attr("height", barHeight)
            .attr("fill", "#4682B4"); // 파란색 (PM10)

        // PM2.5 막대 추가 (PM10 바로 아래)
        svg.selectAll(".bar-pm25")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar-pm25")
            .attr("x", 0)
            .attr("y", (d:any )=>  (y(d.name) as number) + barHeight +10)
            .attr("width", (d:any )=>  x(d.pm25Value))
            .attr("height", barHeight)
            .attr("fill", "#3CB371"); // 초록색 (PM2.5)

        // X축 추가
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        // Y축 추가
        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        // 기준선 값 (예: 100)
        const thresholdValue = 80; 

        // 기준선 추가
        svg.append("line")
            .attr("class", "threshold-line")
            .attr("x1", x(thresholdValue))  // X축 위치 (값에 따라 설정)
            .attr("x2", x(thresholdValue))  // X축 위치 동일
            .attr("y1", 0)  // 맨 위부터 시작
            .attr("y2", height)  // 맨 아래까지
            .attr("stroke", "#ccc")  // 선 색상 (예제처럼 빨강)
            .attr("stroke-width", 2)  // 선 두께
            .attr("stroke-dasharray", "5,5");  // 점선 스타일 (원하면 사용)

        // 범례 추가
        const legend = svg.append("g")
            .attr("transform", `translate(${width - 150}, -20)`);

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", "#4682B4");

        legend.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .text("PM10 (미세먼지)")
            .attr("font-size", "12px")
            .attr("fill", "#333");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", "#3CB371");

        legend.append("text")
            .attr("x", 20)
            .attr("y", 32)
            .text("PM2.5 (초미세먼지)")
            .attr("font-size", "12px")
            .attr("fill", "#333");

        legend.append("line")
            .attr("x1", 0)
            .attr("y1", 65)
            .attr("x2", 20)
            .attr("y2", 65)
            .attr("stroke", "#ccc")
            .attr("stroke-width", 3)
            .attr("stroke-dasharray", "5,5")
            .attr("fill", "#ccc");

        legend.append("text")
            .attr("x", 20)
            .attr("y", 70)
            .text("미세먼지 주의선")
            .attr("font-size", "12px")
            .attr("fill", "#333");


    }, [props.getTodayList]);
  
    return <svg ref={svgRef}></svg>;
  };

  export default BarChart;