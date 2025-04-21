I want to create an electric vehicle charging calculator application. It will consist of 3 main sections:

- car information using the following input fields: Usable capacity kWh (integer in the range of 5-200, default value 72), Consumption kWh/100km (integer in the range of 5-50, default value 18)
- charging details using the input fields: Volts V (integer in the range of 110-240, default value 230), Charging duration hours (fractional number with one decimal point in the range of 1-50, default value 6.5), Current SoC % (integer in the range of 0-100, default value 50), Amps A (integer in the range of 5-32, default value 10)
- results as read-only fields named: SoC after charging %, Charging power kW, Charging speed %/h, Charging speed km/h, Range per charging session

The project should use React and no backend. All input fields should be presented as sliders used to set a value.

The app will be primary used on a smartphone.

---

Add minus and plus buttons on every slider, so user can fine tune the value.
