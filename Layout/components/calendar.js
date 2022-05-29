export const calendarPage = () =>
  `<div id="container" class="container">
  <sidebar id="sidebar" class="sidebar">
    <nav class="menu_navigation">
      <a
        id="calendar-month-id"
        class="menu_item menu_item--active"
        onclick="route()"
        href="/calendar"
      >
        <i class="menu_icon"></i>
        <span class="menu_text">Calendar</span>
      </a>
    </nav>
  </sidebar>
  <div id="data-container" class="calendar">
    <div class="front">
      <div class="current-date">
        <h1 id="current-day">Monday 30</h1>
        <button class="add-event">
          <a onclick="route()" href="/event">+</a>
        </button>
        <button id="arrow" class="arrow"></button>
        <h1 id="currnet-month-year">January 2016</h1>
        <button id="arrow-reverse" class="arrow-reverse"></button>
      </div>
      <div class="current-month">
        <ul class="week-days">
          <li>MON</li>
          <li>TUE</li>
          <li>WED</li>
          <li>THU</li>
          <li>FRI</li>
          <li>SAT</li>
          <li>SUN</li>
        </ul>
        <div class="weeks">
          <div class="first">
            <span class="last-month">28</span>
            <span class="last-month">29</span>
            <span class="last-month">30</span>
            <span class="last-month">31</span>
            <span id="1">01</span>
            <span id="2">02</span>
            <span id="3">03</span>
          </div>
          <div class="second">
            <span id="4">04</span>
            <span id="5">05</span>
            <span id="6" class="event">06</span>
            <span id="7">07</span>
            <span id="8">08</span>
            <span id="9">09</span>
            <span id="10">10</span>
          </div>
          <div class="third">
            <span id="11">11</span>
            <span id="12">12</span>
            <span id="13">13</span>
            <span id="14">14</span>
            <span id="15" class="active">15</span>
            <span id="16">16</span>
            <span id="17">17</span>
          </div>
          <div class="fourth">
            <span id="18">18</span>
            <span id="19">19</span>
            <span id="20">20</span>
            <span id="21">21</span>
            <span id="22">22</span>
            <span id="23">23</span>
            <span id="24">24</span>
          </div>
          <div class="fifth">
            <span id="25">25</span>
            <span id="26">26</span>
            <span id="27">27</span>
            <span id="28">28</span>
            <span id="29">29</span>
            <span id="30">30</span>
            <span id="31">31</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;
