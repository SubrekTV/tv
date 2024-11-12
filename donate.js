/**
the library used: https://github.com/jibrelnetwork/ethereum-qr-code

*/
const donationAdress = "0x712a818B37fA8F349610c0ADfCB405B4c8Cf1366";

const getQrCode = value => {
  const qr = new EtheriumQRplugin.etheriumQRplugin();
  const codeDetails = {
    to: donationAdress,
    value,
    size: 180,
    gas: 21000,
    selector: "#qr-code-container",
    options: {
      margin: 1 } };


  return qr.toCanvas(codeDetails);
};

const copyToClipboard = eventTarget => {
  eventTarget.select();
  document.execCommand('copy');
};

const StageOne = Vue.component("StageOne", {
  name: "StageOne",
  template: "#stage-1-template",
  props: {
    amount: Number },

  data: function () {
    return {
      showSelection: false };

  },
  methods: {
    donate: function () {
      this.$emit("changestage", [2, this.amount]);
    },
    selectAmount: function () {
      this.showSelection = true;
    },
    triggerAmountChange: function () {
      this.showSelection = false;
    } } });



const StageTwo = Vue.component("StageTwo", {
  name: "StageTwo",
  template: "#stage-2-template",
  props: {
    amount: Number },

  data: function () {
    return {
      ethLink: "",
      showNotification: false };

  },
  methods: {
    goBack: function () {
      this.$emit("changestage", [1, this.amount]);
    },
    select: function (event) {
      copyToClipboard(event.target);
      this.showNotification = true;
    } },

  mounted: function () {
    getQrCode(this.amount).then(result => {
      this.ethLink = result.value;
    });
  },
  updated: function () {
    document.getElementById('qr-code-container').innerHTML = '';
    getQrCode(this.amount).then(result => {
      this.ethLink = result.value;
    });
  } });


new Vue({
  el: "#widget",
  template: "#eth-widget-template",
  components: { StageTwo, StageOne },
  data: function () {
    return {
      stage: 1,
      amount: 0.1 };

  },
  methods: {
    checkStage: function (stage) {
      return stage === this.stage;
    },
    changeStage: function (data) {
      this.stage = data[0];
      this.amount = data[1];
    },
    changeAmount: function (amount) {
      this.amount = amount;
    } } });