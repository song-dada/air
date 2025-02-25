import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null); // 초기값 null로 설정

  useEffect(() => {
    // svgRef.current가 null이 아닌 경우에만 실행하도록
    if (svgRef.current) {
      const data: number[] = [24, 30, 45, 70, 26, 60, 90];

      const width = 600;
      const height = 300;
      const margin = { top: 20, right: 30, bottom: 40, left: 40 };

      // x, y 축의 스케일 설정
      const xScale = d3.scaleBand()
        .domain(d3.range(data.length).map(String))  // x 축을 문자열로 변환
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data) as number]) // y축 최대값을 데이터의 최대값으로 설정
        .nice()
        .range([height - margin.bottom, margin.top]);

      // 라인 생성 함수
      const line = d3.line<number>()
        // .x((d, i) => xScale(String(i)) + xScale.bandwidth() / 2)  // x 값을 문자열로 변환
        // .y(d => yScale(d));

      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height);

      svg.selectAll('*').remove();  // 이전 그래프 제거

      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .attr('d', line);

      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));
    }
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default LineChart;
