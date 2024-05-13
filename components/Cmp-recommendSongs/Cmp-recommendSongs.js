Component({
  properties: {
    hotRanking: {
      type: Object,
      value: {}
    }
  },
  methods: {
    btnClick() {
      console.log(this.data.newRanking);
    }
  },
})