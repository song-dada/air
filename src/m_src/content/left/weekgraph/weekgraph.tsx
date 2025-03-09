import React, { useRef, useEffect, useState } from "react";
import * as d3 from 'd3';
import './weekgraph.scss';

interface DataPoint {
  date: Date;
  value: number;
  dataTime: string;
  pm10Value: number;
}

function Weekgraph(props: any) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 200 });

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth * 0.9; 
      const height = 200; 
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    const prevWeekDatas = props.getPrevWeekDatas;
    const data: any[] = prevWeekDatas;
  
    // 차트 크기 설정
    const margin = { top: 10, right: 20, bottom: 20, left: 25 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;
  
    // 스케일 설정
    const x = d3.scaleBand()
      .domain(data.map(d => d.dataTime)) 
      .range([0, width]);
  
    const y = d3.scaleLinear()
      .domain([0, 200]) 
      .nice()
      .range([height, 0]);
  
  
    const xAxisTickFormat = d3.timeFormat("%m-%d");  
  
    // 선 생성
    const line = d3.line<DataPoint>()
      .x(d => x(d.dataTime) as number + (x.bandwidth() / 2))  
      .y(d => y(d.pm10Value)); 
  
    // SVG 요소 선택
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr('preserveAspectRatio', 'xMinYMin meet'); 
  
    svg.selectAll("*").remove(); 
  
    // 선 그리기
    svg.append('path')
      .data([data])
      .attr('class', 'line')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#3F8EF5')
      .attr('stroke-width', 2)
      .attr('transform', `translate(${margin.left},${margin.top})`);  
  
    // x축 추가
    svg.append('g')
      .attr('transform', `translate(${margin.left},${height + margin.top})`) 
      .call(d3.axisBottom(x).tickFormat((d: any) => xAxisTickFormat(new Date(d))));  
  
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
      .attr('x', (d) => x(d.dataTime) as number + (x.bandwidth() / 2))
      .attr('y', (d) => y(d.pm10Value))
      .attr('dy', -5)  
      .attr('text-anchor', 'middle') 
      .attr('fill', '#3F8EF5') 
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .text((d) => d.pm10Value); 
  
  }, [props, dimensions]);
  

  return (
    <div className="App">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default Weekgraph;
