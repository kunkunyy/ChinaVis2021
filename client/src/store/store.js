import vue from 'vue'
import Vuex from 'vuex'
vue.use(Vuex)

export default new Vuex.Store({
    state: { //要设置的全局访问的state对象
        //要设置的初始属性值
        count: 0, //测试变量
        timeselect: 1,
        level: 1,
        levelSecond: 1,
        year: 2013,
        city: '北京市',
        type: "工厂",
        secondtime: "2013-01",
        cityPoint: "石家庄市",
        cityPointOnce: ""
    },
    getters: { //实时监听state变化值
        getCount(state) { //改变count//测试函数
            return state.count;
        },
        getFromtime() {
            return state.fromtime;
        },
        getTotime() {
            return state.totime
        },
        getTimeselect() {
            return state.timeselect;
        },
        getYear() {
            return state.year;
        },
        getCitypoint() {
            return state.cityPoint;
        },
        getSecondtime() {
            return state.secondtime;
        },
        getCity() {
            return state.city;
        },
        getCityPointOnce() {
            return state.cityPointOnce;
        }
    },
    mutations: {
        addCount(state, num) { //在commit时需多传入num参数//测试函数
            state.count = state.count + num;
        }
    },
    actions: {
        getAddCount(context, num) { //调用mutation的方法 可以异步使用//测试函数
            context.commit('addCount', num);
        },
    }
})