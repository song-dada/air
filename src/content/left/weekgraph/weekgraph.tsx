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

      // 차트 크기 설정
      const margin = { top: 10, right: 20, bottom: 20, left: 25 };
      const width = 500 - margin.left - margin.right;
      const height = 200 - margin.top - margin.bottom;

      // 스케일 설정
      const x = d3.scaleBand()
        .domain(data.map(d => d.dataTime))  // x축 데이터 범위 (시간)
        .range([0, width]);

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
        .attr('height', height + margin.top + margin.bottom);

      svg.selectAll("*").remove();

      // 선 그리기
      svg.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', '#3F8EF5')
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

      // 선 위에 데이터 값 표시
      svg.selectAll('.data-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'data-label')
        .attr('x', (d) => x(d.dataTime) as number + (x.bandwidth() / 2)) // x 위치
        .attr('y', (d) => y(d.pm10Value)) // y 위치
        .attr('dy', -5)  // 텍스트 위치 조정 (위로 조금 올리기)
        .attr('text-anchor', 'middle') // 텍스트 중앙 정렬
        .attr('fill', '#3F8EF5') // 텍스트 색
        .attr('transform', `translate(${margin.left},0)`)
        .text((d) => d.pm10Value); // 값 표시

    }, [props]);

  return (
    <div className="App">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default Weekgraph;
