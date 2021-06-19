import {
  Autocomplete,
  Select,
  Option,
  OptionGroup,
  Input,
  InputNumber,
  Radio,
  Tree,
  Dialog,
  Row,
  Col,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  DatePicker,
  Upload,
  Form,
  FormItem,
  Table,
  TableColumn,
  Button,
  Pagination,
  Avatar,
  Alert,
  Message,
  MessageBox,
  Notification,
  Menu,
  MenuItemGroup,
  MenuItem,
  Submenu,
  RadioGroup,
  Rate,
  Progress,
  RadioButton,
  Link,
  Divider,
  Carousel,
  CarouselItem,
  Breadcrumb,
  BreadcrumbItem,
} from "element-ui";
const element = {
  install: function(Vue) {
    Vue.use(Autocomplete)
    Vue.use(BreadcrumbItem);
    Vue.use(Breadcrumb);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(CarouselItem);
    Vue.use(Link);
    Vue.use(Carousel);
    Vue.use(Divider);
    Vue.use(Input);
    Vue.use(InputNumber);
    Vue.use(Radio);
    Vue.use(Dialog);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Checkbox);

    Vue.use(Progress);
    Vue.use(DatePicker);
    Vue.use(Upload);
    Vue.use(Rate);

    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Button);
    Vue.use(Progress);
    Vue.use(Pagination);

    Vue.use(Avatar);
    Vue.use(Alert);

    Vue.use(Rate);
    Vue.use(Menu);
    Vue.use(MenuItem);
    Vue.use(MenuItemGroup);
    Vue.use(Submenu);
    Vue.use(RadioGroup);
    Vue.use(RadioButton);

    Vue.prototype.$message = Message;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$notify = Notification;
  },
};

export default element;
