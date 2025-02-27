import React, { useRef, useEffect, useState } from "react";
import * as d3 from 'd3';
import './weekgraph.scss'

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
        // Function to update the dimensions based on the window size
        const updateDimensions = () => {
            const width = window.innerWidth * 0.8;  // 80% of the viewport width
            const height = 200;
            setDimensions({ width, height });
        };

        // Initial dimension set
        updateDimensions();

        // Add resize event listener
        window.addEventListener('resize', updateDimensions);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, []);

    useEffect(() => {
        const prevWeekDatas = props.getPrevWeekDatas;
        const data: any[] = prevWeekDatas;

        // 차트 크기 설정
        const margin = { top: 10, right: 20, bottom: 25, left: 25 };
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        // Format the date to only show MM-DD (month-day)
        const parseTime = d3.timeParse("%Y-%m-%d");
        const formatTime = d3.timeFormat("%m-%d");

        // 스케일 설정
        const x = d3.scaleBand()
            .domain(data.map(d => formatTime(parseTime(d.dataTime)!)))  // x축 데이터 범위 (시간), formatted date
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, 200])  // y축 데이터 범위 (값)
            .nice()
            .range([height, 0]);

        // 선 생성
        const line = d3.line<DataPoint>()
            .x(d => x(formatTime(parseTime(d.dataTime)!)) as number + (x.bandwidth() / 2))  // x축 값
            .y(d => y(d.pm10Value));  // y축 값

        // SVG 요소 선택
        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .attr('preserveAspectRatio', 'xMinYMin meet'); // Ensure aspect ratio is preserved

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

        // x축 추가 with formatted date labels
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
            .attr('x', (d) => x(formatTime(parseTime(d.dataTime)!)) as number + (x.bandwidth() / 2)) // x 위치
            .attr('y', (d) => y(d.pm10Value)) // y 위치
            .attr('dy', -5)  // 텍스트 위치 조정 (위로 조금 올리기)
            .attr('text-anchor', 'middle') // 텍스트 중앙 정렬
            .attr('fill', '#333') // 텍스트 색
            .attr('transform', `translate(${margin.left},0)`)
            .style('font-size', `${Math.max(10, (width / 500) * 12)}px`) // Adjust font size dynamically
            .text((d) => d.pm10Value); // 값 표시

    }, [props, dimensions]); // Re-run effect when dimensions change

    return (
        <div className="App">
            <svg ref={svgRef}></svg>
        </div>
    );
}

export default Weekgraph;
