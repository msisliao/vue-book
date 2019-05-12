### 项目介绍
- 主要页面
1、首页home.vue分类展示书籍，幻灯片展示热门推荐
2、搜索search.vue，上拉加载更多
3、书籍详情book.vue加入书架、立即阅读，展示评论，同类书籍推荐
4、书籍内容read.vue，获取目录，存储翻阅的章节位置
5、书架bookrack.vue，获取加入书架的书单
- 技术栈
vue、vue-cli、axios、vue-router、vuex、localStorege

### app.vue入口页面

 - 分成底部导航 跟 主视图容器 `router-view`

### tabbar/Home为首页

 - 包含： components/sub/item 和 components/sub/search 、components/sub/header 
 - 结构： banner切换 与 搜索 和 小说分类楼层
 >  小说楼层单独定义了组件 `components/sub/item` , home循环楼层分类名称，并将楼层分类id传给item组件 `:booklistId='{id:item._id}'` , item组件用`props: ["booklistId"]` 接收分类id, 并根据分类id获取对应的数据

 **item.vue**
 ```javascript
 mouted:
   this.getlist(this.booklistId.id);

 methods:
   getlist(id) {
     //每个分类id下对应的数据  子组件接收父组件传过来的id 获取对应的数据
      bootd(id).then(res => {
        var arrdata = res.data.data;
        arrdata.map(item => {
          this.booklist.push(item.book);
        });
      });
    }

 ```


###  components/book/Book.vue为小说详情页

- 包含： components/sub/yuedu 、mulu、pinglun、
- 结构： 小说概况与简介，是否加入书架或者继续阅读 ，目录、评论、同类书籍推荐

> 加入书架/立即阅读(yuedu.vue)组件
 加入书架，获取书籍信息，并把相关书籍信息存放在书架中、存local

 **book.vue**

```javascript
   computed: {
       ...mapState(['calbook','shuajiabook'])  //书籍信息  书架数据[]
     },
     methods:{
        addbook(){
            this.flag=!this.flag
            var book= this.calbook; // calbook 是store里存储的书籍信息【  SHEFLBOOK  】
            var carbook = JSON.parse(window.localStorage.getItem('book') || '{}')
           if(!this.flag){ //加入书架
              carbook[book._id] = {
                  cover: book.cover,
                  flag:!this.flag,
                  title: book.title,
                  lastChapter:book.lastChapter,
                  id: book._id,
                  author:book.author,
                  chapterIndexCache: 0,
                  bookSource: 0,
                  pageIndexCache: 0,
               }
              this.setbook(false)
              window.localStorage.setItem('book', JSON.stringify(carbook))
          }else{
              delete carbook[book._id]
                this.setbook(true) //设置的布尔值
                window.localStorage.setItem('book', JSON.stringify(carbook))
          }
        }
    }


立即阅读时进入小说章节  `this.$router.push({name:'read',params:{id:this.booklinks}})`

```

 目录组件`components/sub/mulu.vue`

点击目录时，路由跳转进入`read.vue`页面(小说详细章节)，并且将默认目录显示出来，书籍id通过路由传给`mulu.vue`

**book.vue**

```javascript
 <router-link :to="{name:'read',params:{id:this.books._id,showMulu:true}}" class="mulu" tag="p">

```
**read.vue** 包含mulu组件，默认目录隐藏，通过路由传参决定是否显示目录

```javascript
 <mulu :id="id" @readShow='readshows' v-show="showMulu" @closeLayer='backGo()'></mulu>

 // 控制目录显示状态
 created() {
      this.getBook = JSON.parse(window.localStorage.getItem("SHEFLBOOK")); // book/book.vue 存储的书籍信息
      this.getbookhy(this.getBook._id); // 获取小说id所对应的源   
      if(this.$route.params.showMulu){ //从book.vue传过来的参数
          this.showMulu = true
      }
  },

// 子组件mulu.vue发送过来的事件，点击时跳转到对应的章节内容
  readshows(index){
      this.showMulu = false
      this.iss = index
      this.getBookindex()
      this.getcontent(this.booklinkss[this.iss]); //根据booklinkss显示目录章节
      this.$refs.dvtop.scrollTop = 0;
   },

```
**mulu.vue**

```javascript
 <li v-for="item in list" :key="item.id" @click='getMulu((item.order)-1)'>{{item.title}} <em style="color:red">{{item.isVip?'vip':null}}</em></li>

     getMulu(i){
         this.$emit('readShow',i) //将点击的章节传给父组件 read.vue
      }

```




**pinglun.vue**

 评论组件(pinglun.vue),获取路由中的参数书籍id,在item.vue中` <router-link tag='li' :to="{name:'book',params:{id:item._id}}">`路由跳转到详情，并将书籍id传给书籍详情

```javascript
  created() {
    this.loadMore();
  },

  methods: {
    loadMore() {
      bookpl(this.$route.params.id, this.limit).then(res => { // 获取的item组件的路由参数 书籍id
        if (res.status === 200) {
          this.pinglun = res.data.reviews;
          this.limit += 5;
        }
      });
      this.loading = false;
    }
  }

```


###  components/read/read.vue为小说章节详情

- 包含： components/sub/mulu 、
- 结构：上一章下一章，目录，章节内容

 获取localstorege的书籍信息SHEFLBOOK中的(id)，[book.vue存储了localstorege], 根据小说id获取**【源--目录--内容】**，点击目录进入章节详情,将点击的章节存入local,记住每次点击的章节位置，供后续阅读

 **read.vue**

```javascript
     //获取小说资源 每本小说有多个资源  根据小说id获取小说的来源
     getbookhy(id){
        bookhy(id).then(res=>{
          this.bookhylist = res.data;
          this.getmulu(this.bookhylist[0]._id);     //   根据源 获取目录数据 默认第一个源
        })
     },
    getmulu(id){
      this.booklinkss = []; //第N章内容
      this.booktitle = []; //第N章标题 push后数据叠加 现将数组数据清空
      var bookindexs = JSON.parse( window.localStorage.getItem("bookindex") || "{}" ); //章节位置

      bookmulu(id).then(res=>{
       if(res.status==200){
             res.data.chapters.forEach( item => {
          // 内容是根据link来获取的 将link发给服务器，由于// / & # 服务器是无法识别的 所以需要对link转码  最后服务器返回内容   
             this.booklinkss.push(encodeURIComponent(item.link))
             this.booktitle.push(item.title)
         });
       }
        this.iss = bookindexs && bookindexs[this.getBook._id] ? bookindexs[this.getBook._id].bookindex  : this.iss;
        this.getcontent(this.booklinkss[this.iss]);    //  根据目录   获取内容   
      })
    },

      //  获取内容
      getcontent(link){
          var content = []
          bookcontent(link).then(res => {
             if(res.status == 200){
                var datas = res.data.chapter;
                content.push({
                    cpContent:datas.isVip?["vip章节，请购买VIP"]:(datas.cpContent ? datas.cpContent.split("\n") : datas.body.split("\n")),
                    title:datas.title
                })
                this.con = content[0]
             }
          })
      },
 ```

###  components/read/search.vue为小说搜索页
- 调用MUI的  `mt-loadmore`功能，上拉加载更多，
```JavaScript
    //获取搜索的书籍
    getList() {
      booksearch(this.keyword).then(res => {
        if (res.data.ok) {
          this.searchList = res.data.books.slice(0, 15); //默认展示前15条数据
        }
      });
    },
        // 上拉加载
    loadBottom() {
       this.allLoaded = true; //上滑时出现加载文字
       booksearch(this.keyword).then(res=>{
         if(this.searchList.length==res.data.books.length){
           this.allLoaded = false
         }else{
           this.searchList = res.data.books.splice(0,this.count*15+15)  //每次拉动时在现有基础上加15条 cout++
           this.count++
           this.allLoaded = false 
         }
       })
    },
```
