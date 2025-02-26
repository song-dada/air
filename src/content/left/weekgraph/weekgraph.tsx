import React, { useRef, useEffect } from "react";
import * as d3 from 'd3';

import './weekgraph.scss'

interface DataPoint {
    date: Date;
    value: number;
    dataTime: string;
    pm10Value: number;
  }

function Weekgraph( props: any ) {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
      const prevWeekDatas = props.getPrevWeekDatas;
      const data: any[] = prevWeekDatas;
      // console.log(prevWeekDatas);
      // console.log("Weekgraph file props check")
      // upd2/air2/src/content/left/weekgraph/weekgraph.tsxconsole.log(props)
      
      // 차트 크기 설정
      // const margin = { top: 10, right: 20, bottom: 20, left: 20 };
      const margin = { top: 10, right: 20, bottom: 20, left: 25 };
      const width = 500 - margin.left - margin.right;
      const height = 200 - margin.top - margin.bottom;

      // 스케일 설정
      const x = d3.scaleBand()
        .domain(data.map(d => d.dataTime))  // x축 데이터 범위 (시간)
        .range([0, width]);

      // const y = d3.scaleLinear()
      //   .domain([0, d3.max(data, d => d.pm10Value) as number])  // y축 데이터 범위 (값)
      //   .nice()
      //   .range([height, 0]);

      const y = d3.scaleLinear()
        .domain([0, 200])  // y축 데이터 범위 (값)
        .nice()
        .range([height, 0]);

      // 선 생성
      const line = d3.line<DataPoint>()
        .x(d => x(d.dataTime) as number + (x.bandwidth() / 2))  // x축 값
        .y(d => y(d.pm10Value));  // y축 값

      // SVG 요소 선택
      const svg = d3.select(svgRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        // .append('g')
        // .attr('transform', `translate(${margin.left},${margin.top})`);

        svg.selectAll("*").remove();

      // 선 그리기
      svg.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .attr('transform', `translate(${margin.left},0)`);


      // x축 추가
      svg.append('g')
        .attr('transform', `translate(${margin.left},${height})`)
        .call(d3.axisBottom(x));

      // y축 추가
      svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .call(d3.axisLeft(y));

      svg.selectAll(".pm10-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "pm10-label")
      .attr("x", d => x(d.date)!)  // ✅ X축 좌표 설정
      .attr("y", d => y(d.pm10Value ?? d.value)! - 10)  // ✅ Y축 좌표 설정
      .text(d => d.pm10Value ?? d.value)
      .attr("font-size", "12px")
      .attr("fill", "blue")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${margin.left},0)`);


    }, [props]);

  return (
    <div className="App">
      <svg ref={svgRef}></svg>
    </div>
  );

}

export default Weekgraph