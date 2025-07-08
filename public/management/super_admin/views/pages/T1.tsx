import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import {
    Chart,
    BarController,
    BarElement,
    PointElement,
    ArcElement,
    PieController,
    LinearScale,
    Tooltip,
    Legend,
    Title,
    CategoryScale,
} from 'chart.js';
import UserLoginHistory from '../components/UserLoginHistory';

Chart.register(
    BarController,
    BarElement,
    PointElement,
    ArcElement,
    PieController,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip,
    Legend,
);

export interface Props { }

const T1: React.FC<Props> = () => {
    const [data, setData] = useState<{
        students: any[];
        parents: any[];
        teachers: any[];
        staff: any[];
        librarians: any[];
        accountants: any[];
        receptionists: any[];
    }>({
        students: [],
        parents: [],
        teachers: [],
        staff: [],
        librarians: [],
        accountants: [],
        receptionists: [],
    });

    const barChartRef = useRef<HTMLCanvasElement>(null);
    const pieChartRef = useRef<HTMLCanvasElement>(null);
    const barChartInstance = useRef<Chart | null>(null);
    const pieChartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const roles = [3, 6, 4, 5, 7, 8, 9];
                const roleKeys = [
                    'students',
                    'parents',
                    'teachers',
                    'staff',
                    'librarians',
                    'accountants',
                    'receptionists',
                ];

                const fetchPromises = roles.map((role) =>
                    axios.get(`/api/v1/auth/users-by-role?role_serial=${role}&orderByCol=id&orderByAsc=true&show_active_data=true&paginate=10`)
                );

                const responses = await Promise.all(fetchPromises);

                if (isMounted) {
                    const newData = responses.reduce((acc, response, index) => {
                        acc[roleKeys[index]] = response.data.data.data;
                        return acc;
                    }, {} as any);

                    setData(newData);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
            if (barChartInstance.current) barChartInstance.current.destroy();
            if (pieChartInstance.current) pieChartInstance.current.destroy();
        };
    }, []);

    useEffect(() => {
        if (barChartRef.current) {
            barChartInstance.current = new Chart(barChartRef.current, {
                type: 'bar',
                data: {
                    labels: [
                        'Students',
                        'Parents',
                        'Teachers',
                        'Staff',
                        'Librarians',
                        'Accountants',
                        'Receptionists',
                    ],
                    datasets: [
                        {
                            label: 'Total Count',
                            data: [
                                data.students.length,
                                data.parents.length,
                                data.teachers.length,
                                data.staff.length,
                                data.librarians.length,
                                data.accountants.length,
                                data.receptionists.length,
                            ],
                            backgroundColor: [
                                '#FF5733',
                                '#33FF57',
                                '#3357FF',
                                '#FF33A1',
                                '#A133FF',
                                '#FFC300',
                                '#DAF7A6',
                            ],
                            borderColor: 'black',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'User Statistics',
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }

        if (pieChartRef.current) {
            pieChartInstance.current = new Chart(pieChartRef.current, {
                type: 'pie',
                data: {
                    labels: ['Students', 'Parents', 'Teachers'],
                    datasets: [
                        {
                            data: [
                                data.students.length,
                                data.parents.length,
                                data.teachers.length,
                            ],
                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Distribution of Students, Parents, and Teachers',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    let value = context.raw || 0;
                                    return `${label}${value}`;
                                },
                            },
                        },
                    },
                },
            });
        }

        return () => {
            if (barChartInstance.current) barChartInstance.current.destroy();
            if (pieChartInstance.current) pieChartInstance.current.destroy();
        };
    }, [data]);

    return (
        <div className="container">
            <div className="row my-4">
                {/* Card Item */}
                {[
                    { title: "Students", src: "/assets/dashboard/images/student.png", count: data.students?.length },
                    { title: "Parents", src: "/assets/dashboard/images/parent.png", count: data.parents?.length },
                    { title: "Teachers", src: "/assets/dashboard/images/teacher.png", count: data.teachers?.length },
                    { title: "Staff", src: "/assets/dashboard/images/staff.png", count: data.staff?.length },
                ].map((item, index) => (
                    <div className="col-xl-3 col-lg-4" key={index}>
                        <div className="card" data-intro={index === 0 ? "This is card" : undefined}>
                            <div className="business-top-widget card-body">
                                <div className="media d-inline-flex items-center gap-2">
                                    {/* Image */}
                                    <img
                                        width={50}
                                        height="auto"
                                        src={item.src}
                                        alt={item.title}
                                    />

                                    {/* Vertical Divider */}
                                    <div
                                        style={{
                                            height: '60px',
                                            width: '1px',
                                            backgroundColor: '#ccc',
                                            margin: '0 16px',
                                        }}
                                    />


                                    {/* Content */}
                                    <div className="media-body">
                                        <span className="mb-2">{item.title}</span>
                                        <h2 className="total-value m-0 counter">{item.count}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            <div className="row my-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3>User Statistics</h3>
                            <canvas ref={barChartRef}></canvas>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header py-1">
                            <h3 className="m-0">
                                Distribution of Students, Parents, and Teachers
                            </h3>
                        </div>
                        <div className="card-body">
                            <canvas ref={pieChartRef}></canvas>
                        </div>
                    </div>
                </div>
            </div>

            {/* New row for Calendar and User Login History */}
            <div className="row my-4">
                
                <div className="col-md-12">
                    <UserLoginHistory />
                </div>
            </div>
        </div>
    );
};

export default T1;