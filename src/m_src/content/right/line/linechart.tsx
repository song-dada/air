import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { khaiVFunc } from "../../khaiVfunc";

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

function LineChart(props: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pm10Data, setPm10Data] = useState<DataPoint[]>([]);
  const [pm25Data, setPm25Data] = useState<DataPoint[]>([]);

  // 화면 크기 반응형 상태
  const [dimensions, setDimensions] = useState({ width: window.innerWidth * 0.9, height: 300 });

  // 창 크기 변경 시 차트 크기 업데이트
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth * 0.9, height: 300 });
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // PM10 및 PM25 데이터 처리
  useEffect(() => {
    if (props.onPm10?.length > 0) {
      let list: any[] = [];
      for (let i = 0; i < props.onPm10.length; i++) {
        const val = khaiVFunc("pm10Value", props.onPm10[i]["pm10Value"]);
        let insertV = {
          name: "pm10Value",
          date: props.onPm10[i]["dataTime"],
          value: val?.original,
        };
        list.push(insertV);
      }
      setPm10Data(list);
    }

    if (props.onPm25?.length > 0) {
      let list: any[] = [];
      for (let i = 0; i < props.onPm25.length; i++) {
        const val = khaiVFunc("pm25Value", props.onPm25[i]["pm25Value"]);
        if (val?.value === null) {
          continue;
        }
        let insertV = {
          name: "pm25Value",
          date: props.onPm25[i]["dataTime"],
          value: val?.original,
        };
        list.push(insertV);
      }
      setPm25Data(list);
    }
  }, [props]);

  // 차트 그리기
  useEffect(() => {
    if (!svgRef.current) return;

    const { width, height } = dimensions;
    const margin = { top: 20, right: 30, bottom: 60, left: 40 };

    const parseDate = d3.timeParse("%Y-%m-%d");

    // pm10Data와 pm25Data를 합쳐서 스케일링을 진행합니다.
    const datas = [...pm10Data, ...pm25Data];
    const minX = d3.min(datas, (d) => parseDate(d.date))!;
    const maxX = d3.max(datas, (d) => parseDate(d.date))!;

    const xScale = d3.scaleTime()
      .domain([new Date(minX), new Date(maxX)])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, 200])
      .range([height - margin.bottom, margin.top]);

    const lineGenerator = (data: DataPoint[]) =>
      d3.line<DataPoint>()
        .x((d) => xScale(parseDate(d.date)!))
        .y((d) => yScale(d.value))(data);

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // 기존 내용 지우기
    svg.selectAll("*").remove();

    // X축 추가
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale)
        .tickValues(pm10Data.map((d) => parseDate(d.date)).filter(Boolean) as Date[])
        .tickFormat((d) => d3.timeFormat("%m-%d")(d as Date))
      );

    // Y축 추가
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    // PM10 선 그리기
    svg.append("path")
      .datum(pm10Data)
      .attr("fill", "none")
      .attr("stroke", "#3F8EF5")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator(pm10Data));

    // PM25 선 그리기
    svg.append("path")
      .datum(pm25Data)
      .attr("fill", "none")
      .attr("stroke", "#FF595E")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator(pm25Data));

    // PM10 값 레이블 추가
    svg.selectAll(".pm10-label")
      .data(pm10Data)
      .enter()
      .append("text")
      .attr("class", "pm10-label")
      .attr("x", (d) => xScale(parseDate(d.date)!))
      .attr("y", (d) => yScale(d.value)! - 10)
      .text((d) => d.value)
      .attr("font-size", Math.max(10, (width / 500) * 12) + "px") // 반응형 글자 크기
      .attr("fill", "blue")
      .attr("text-anchor", "middle");

    // PM25 값 레이블 추가
    svg.selectAll(".pm25-label")
      .data(pm25Data)
      .enter()
      .append("text")
      .attr("class", "pm25-label")
      .attr("x", (d) => xScale(parseDate(d.date)!))
      .attr("y", (d) => yScale(d.value)! - 10)
      .text((d) => d.value)
      .attr("font-size", Math.max(10, (width / 500) * 12) + "px") // 반응형 글자 크기
      .attr("fill", "red")
      .attr("text-anchor", "middle");

    // 범례 데이터
    const legendData = [
      { name: "미세먼지", value: 30, color: "#3F8EF5" },
      { name: "초미세먼지", value: 28, color: "#FF595E" },
    ];

    // 화면 크기가 작은지 확인
    const isMobile = width < 500;

    // 화면 크기에 따라 범례 위치 조정
    const legend = svg.append("g")
      .attr("transform", isMobile ? `translate(${margin.left + (width / 2 + 30) }, ${margin.top})` : `translate(${width / 2 + 150}, ${margin.top})`)
      .selectAll("g")
      .data(legendData)
      .join("g")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    // 색상 박스 추가
    legend.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d) => d.color);

    // 범례 텍스트 추가 (단어 줄바꿈)
    legend.append("text")
      .selectAll("tspan")
      .data((d) => d.name.split(" ")) // 띄어쓰기 기준으로 단어 나누기
      .enter()
      .append("tspan")
      .attr("x", 20)
      .attr("y", 0)
      .attr("dy", "1em")
      .text((d: any) => d)
      .attr("font-size", Math.max(10, (width / 500) * 12) + "px") // 반응형 글자 크기
      .attr("fill", "#333");

  }, [pm10Data, pm25Data, dimensions]); // 데이터나 화면 크기 변경 시 재렌더링

  return <svg ref={svgRef}></svg>;
}

export default LineChart;
