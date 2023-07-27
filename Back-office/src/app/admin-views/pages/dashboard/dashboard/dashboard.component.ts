import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { LoginHistoryService } from 'src/app/services/LoginHistory.service';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import { AccessService } from 'src/app/services/access.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/entity/product';
import HighchartsHeatmap from 'highcharts/modules/heatmap';
import { StatisticsService } from 'src/app/services/statistics.service';

HighchartsHeatmap(Highcharts);
HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit , AfterViewInit, OnDestroy{

  usersCount: number=0;
  activeUsersCount: number=0;
  inactiveUsersCount: number=0;
  modulesCount: number=0;
  activeModulesCount :number=0;
  inactiveModulesCount: number=0;
  productsCount: number=0;
  activeProductsCount :number=0;
  inactiveProductsCount: number=0;
  licensesCount: number=0;
  activeLicensesCount :number=0;
  inactiveLicensesCount: number=0;
  percentage: number=0;
  loginData: any[] = [];
  chartOptions: any;
  mostActiveAccess: any; // This will hold the data of the most active access
  mostActiveProduct!: Product; // This will hold the data of the most active product

  constructor(private loginHistoryService: LoginHistoryService, private statisticsService : StatisticsService, private accessService : AccessService , private productService :ProductService) { }

  ngOnInit() {
    // Fetch the login history data from the backend API
    this.loginHistoryService.getLoginHistory().subscribe(
      (data: any[]) => {
        this.loginData = data;
        // Create the pie chart for logins per user
        this.createChartPie();
        // Get the data for the most active access
       
      },
      (error: any) => {
        console.error('Error fetching login history data:', error);
      }
    );

    this.statisticsService.getUsersStatistics().subscribe((data: any) => {
      this.usersCount = data.usersCount;
      this.activeUsersCount = data.activeUsersCount;
      this.inactiveUsersCount = data.inactiveUsersCount;
      //this.getProductsPercentage();
      Highcharts.chart('container', this.options);
    });

    this.statisticsService.getModulesStatistics().subscribe((data: any) => {
      this.modulesCount = data.modulesCount;
      this.inactiveModulesCount = data.inactiveModulesCount;
      this.activeModulesCount = data.activeModulesCount;
      
    });

    this.statisticsService.getProductsStatistics().subscribe((data: any) => {
      this.productsCount = data.productsCount;
      this.inactiveProductsCount=data.inactiveProductsCount;
      this.activeProductsCount = data.activeProductsCount;
    });

    this.statisticsService.getLicensesStatistics().subscribe((data: any) => {
      this.licensesCount = data.licensesCount;
      this.inactiveLicensesCount=data.inactiveLicensesCount;
      this.activeLicensesCount=data.activeLicensesCount;
    });


       // Fetch the most active access data from the backend API
    this.accessService.getMostActiveAccess().subscribe(
      (data: any) => {
        this.mostActiveAccess = data;
        this.createMostActiveAccessChart();
      },
      (error: any) => {
        console.error('Error fetching most active access:', error);
      }
    );
     // Fetch the most active product data from the backend API
     this.productService.getMostActiveProduct().subscribe(
      (data: Product) => {
        this.mostActiveProduct = data;
        this.createMostActiveProductChart();
      },
      (error: any) => {
        console.error('Error fetching most active product:', error);
      }
    );
  
  }


  public options: any = {
    Chart: {
      type: 'area',
      height: 400
    },
    title: {
      text: 'Evolution'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: ['2016', '2017', '2018', '2019', '2020', '2021', '2022'],
      tickmarkPlacement: 'on',
      title: {
          enabled: false
      }
  },
  series: [{
    name: 'Products',
    data: [502, 635, 809, 947, 1402, 3634, 5268]
}, {
    name: 'Modules',
    data: [163, 203, 276, 408, 547, 729, 628]
}, {
    name: 'Licenses',
    data: [18, 31, 54, 156, 339, 818, 1201]
}]
  }


  createChartPie(): void {
    const chartData: any[] = this.loginData.map(item => ({
      name: item.username,
      y: 1, // Since we are visualizing logins per user, set y to 1 for each data point
      email: item.email, // Store the email for tooltip display
      date: item.loginHistory.length > 0 ? item.loginHistory[0].loginTime : 'Not logged in yet', // Access the loginTime property or display "Not logged in yet"
      timeOnPlatform: item.loginHistory.length > 0 ? this.calculateTimeOnPlatform(item.loginHistory[0].loginTime) : 'N/A', // Calculate time on platform or display "N/A"
    }));

    const chart = Highcharts.chart('chart-pie', {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Logins per User',
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        headerFormat: '<span class="mb-2">Username: {point.key}</span><br>',
        pointFormat: '<span>Email: {point.email}</span><br><span>Date: {point.date}</span><br><span>Time on Platform: {point.timeOnPlatform}</span>',
        useHTML: true,
      },
      series: [{
        name: null,
        innerSize: '80%',
        data: chartData,
      }],
    } as any);

  chart.update({
    chart: {
      height: '50%', 
    },
    plotOptions: {
      pie: {
        size: '100%', 
      },
    },
  });
  }

  calculateTimeOnPlatform(loginTime: string): string {
    const loginDateTime = new Date(loginTime);
    const currentTime = new Date();
    const timeDiff = currentTime.getTime() - loginDateTime.getTime();

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  }
  

  createMostActiveAccessChart(): void {
    if (!this.mostActiveAccess || typeof this.mostActiveAccess !== 'object') {
      return;
    }
  
    // Extract the access name and number of licenses from the mostActiveAccess data
    const accessName: string = this.mostActiveAccess.accessName;
    const numberOfLicenses: number = this.mostActiveAccess.numberOfLicenses;
  
    // Create the chart using Highcharts
    const chart = Highcharts.chart('most-active-access-chart', {
      chart: {
        type: 'bar', 
      },
      title: {
        text: 'Most Active Role',
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: [accessName], // Set access name as category on X-axis
      },
      yAxis: {
        title: {
          text: 'Number of Licenses',
        },
      },
      series: [{
        type: 'bar', 
        name: 'Number of Licenses',
        data: [numberOfLicenses], // Set the license count as data for the chart
      }],
    });

    chart.update({
      chart: {
        height: '50%', 
      },
    });
  }
  createMostActiveProductChart(): void {
    if (!this.mostActiveProduct || !this.mostActiveProduct.modules || this.mostActiveProduct.modules.length === 0) {
      return;
    }
  
    // Extract product name and module data for the mostActiveProduct
    const productName: string = this.mostActiveProduct.productName;
    const moduleNames: string[] = this.mostActiveProduct.modules.map((module: any) => module.moduleName);
  
    // Prepare the data for the chart
    const chartData: number[][] = moduleNames.map((moduleName, index) => [index, 0]); // Remove the extra value
  
    // Create the chart using Highcharts
    const chart = Highcharts.chart('most-active-product-chart', {
      chart: {
        type: 'heatmap', // Use 'heatmap' chart type to display modules horizontally and product names vertically
        inverted: true, // Invert the axes to have product names on the Y-axis
      },
      title: {
        text: 'Most Active Product and Its Modules',
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: moduleNames, // Use module names as categories on the X-axis
        title: {
          text: 'Modules',
        },
      },
      yAxis: {
        categories: [productName], // Use product name as category on the Y-axis
        title: {
          text: 'Product Name',
        },
        labels: {
          formatter: function () {
            // Wrap product names to fit the chart
            const label = this.value.toString();
            return label.length > 10 ? label.substring(0, 10) + '...' : label;
          }
        }
      },
      colorAxis: {
        min: 0,
        max: 1,
        stops: [
          [0, '#FFFFFF'], // White color for the heatmap
          [1, '#1f78b4']  // Blue color for the heatmap
        ],
      },
      series: [{
        data: chartData,
        borderWidth: 1, // Add border between heatmap cells for better visibility
        keys: ['x', 'y'], // Define the keys for x and y
        dataLabels: {
          enabled: true,
          format: '{point.xCategory}', // Display module name as data label on the heatmap cells
        }
      }] as Highcharts.SeriesOptionsType[], // Type assertion to ensure the data is recognized as SeriesOptionsType
    });
  
    chart.update({
      chart: {
        height: '25%',
      },
    });
  }

  ngAfterViewInit() {
    this.createChartPie();
    this.createMostActiveAccessChart();
    this.createMostActiveProductChart();
  }

  ngOnDestroy() {
    // Destroy the charts when the component is destroyed to avoid memory leaks
    Highcharts.charts.forEach((chart) => {
      if (chart) {
        chart.destroy();
      }
    });
  }
}