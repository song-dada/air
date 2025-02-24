import React, { useState, useEffect, useRef } from "react";
import { khiVFunc  } from "../../khiVfunc";
import * as d3 from "d3";

import { PieArcDatum } from "d3-shape";
interface DataItem {
    name: string;
    unit: string;
    value: number;
    original: number;
  }
const PieChart = (props: any) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    // console.log(props.onOneRow); // 넘겨 온 값 확인
    const [conut, setConut] = useState(0);
    
    useEffect(() => {
        if (!svgRef.current) return;
        
        let data: any[]=[];
        for (const key in props.onOneRow) {
        if(key.includes("Value")) { // 값인경우
            data.push( khiVFunc( key, props.onOneRow[key] ) );
            }
        }
        data = data.filter(d => d !== null && d !== undefined);
        if (!data || data.length === 0) return;

        
        // Specify the chart’s dimensions.
        const width =  500; // 너비
        const height = Math.min(width, 300); // 높이

        // Create the color scale.
        const color = d3.scaleOrdinal() // d3기본제공 색상 사용
            .domain(data.map(d => d.name))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

        // Create the pie layout and arc generator.
        const pie = d3.pie<DataItem>()
            .sort(null)
            .value(d => {
                // console.log("d:", d.value); // 개별 데이터 확인
                return d.value;
            });
            
        const arc = d3.arc<PieArcDatum<DataItem>>()
            .innerRadius(0) // 도넛차트로 쓸거면 사용하면 됨(내부 원)
            // .outerRadius(Math.min(width, height) / 2 - 1);
            .outerRadius(width / 4); // 원 크기

        // const labelRadius = Math.min(width, height) / 2 - 1 // 반지름
        const arcLabel = d3.arc<PieArcDatum<DataItem>>()
            .innerRadius(Math.min(width, height) / 5) // 🔥 1/3보다 조금 더 크게 조정 // 이건 밖으로 밀어내는건가
            .outerRadius(Math.min(width, height) / 3); // 원 밖으로 조금 밀어내기 // 숫자가 커질수록 안으로 들어옴

        const arcs = pie(data);

        // Create the SVG container.
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 3, -height / 2, width, height]) // 중앙점 잡는것 같은데

        // Add a sector path for each value.
        svg.append("g")
            .attr("transform", d => {
                if (!d) return "translate(0,0)";
                const [x, y] = arcLabel.centroid(d);
                return `translate(${x}, ${y + 10})`; // 🔥 y 좌표를 +10 해서 조금 아래로 내림
            })
            .attr("stroke", "white")
            .selectAll("path")
            .data(arcs)
            .join("path")
            .attr("fill", d => color(d.data.name ?? "defaultColor") as string)
            .attr("d", d => {
                // console.log("arc path:", arc(d)); // 여기 확인
                return arc(d);
            });


        // Create a new arc generator to place a label close to the edge.
        // The label shows the value if there is enough room.
        svg.append("g")
            .selectAll("text")
            .data(arcs)
            .join("text")
            .attr("transform", d => {
                // console.log("라벨 위치 확인:", d.data.name, arcLabel.centroid(d));
                return `translate(${arcLabel.centroid(d)})`;
            })
            .attr("text-anchor", d => {
                if (!d) return "middle"; // 만약 d가 없으면 중앙 정렬로 기본값 설정
                const [x] = arcLabel.centroid(d);
                return x > 0 ? "start" : "end"; // 오른쪽이면 start, 왼쪽이면 end
            })
            // .call(text => text.append("tspan")
            //     .attr("y", "-0.4em")
            //     .attr("font-weight", "bold")
            //     .text(d => d.data.name))
            .call(text => text.append("tspan")
                .attr("x", 0)
                .attr("y", "0.7em")
                .attr("fill-opacity", 0.7)
                .text(d => d.data.original));
                // .text(d => d.data.value));

        // 범례
        const legendData = data.map(d => ({ name: d.name, color: color(d.name) }));
        const legend = svg.append("g")
                // .attr("transform", `translate(${width / 2 - 400}, ${height / 2})`) // 위치 조정
                // .attr("transform", `translate(${width - 150}, 20)`) // 위치 조정
                .attr("transform", `translate(${width / 3 }, ${height / 10 - 10})`) 
                // .attr("transform", `translate(${-width / 2}, ${-height / 2})`) 
                .selectAll("g")
                .data(legendData)
                .join("g")
                .attr("transform", (d, i) => `translate(0, ${i * 20})`); // 범례 간격 설정
            // 색상 박스 추가
            legend.append("rect")
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", (d) => d.color as string);

            // 범례 텍스트 추가
            legend.append("text")
                // .attr("x", 20)  // 아이콘과 텍스트 간격
                // .attr("y", 10)  // 아이콘과의 세로 정렬
                // .attr("dy", "0.35em") // 줄 간격 조정
                // .attr("font-size", "12px")
                // .text(d => d.name);
                .selectAll("tspan")
                .data(d => d.name.split(" ")) // 띄어쓰기 기준으로 줄바꿈
                .enter()
                .append("tspan")
                .attr("x", 20)
                .attr("dy", "1em") // 줄 간격 조정
                .text((d: any) => d);
            
            // legend.attr("transform", `translate(${width - 100}, ${height / 2})`);
            // console.log("범례 요소들:", d3.selectAll(".legend").nodes());


        if (svgRef.current) {
            svgRef.current.innerHTML = ""; // 기존 내용 제거
            svgRef.current.appendChild(svg.node()!);
        }
            
    }, [props.onOneRow]);
  
    return (
        <>
        {/* {conut}
        <button type="button" onClick={ ()=>{ setConut(prev => prev+1)} }>click</button> */}
            <div style={{ width: "500px", height: "300px", minHeight: "300px" }}>
                <svg ref={svgRef} width="100%" height="100%" />
            </div>
        </>
    );
  };

export default PieChart;