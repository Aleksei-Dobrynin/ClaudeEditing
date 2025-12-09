import React from 'react';
import './TableStyles.css';
import { observer } from 'mobx-react';
import store from './store';
import { Link } from "react-router-dom";
import { APPLICATION_STATUSES } from "constants/constant";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const PaidPriceDifference = (sum, paid) => {
  const difference = paid - sum;
  const isSignificant = Math.abs(difference) > 0;
  const color = !isSignificant ? "black" : difference > 0 ? "blue" : "red";

  return (
    <td style={{ color }}>
      {paid}
    </td>
  );
};



const TableTemplate: React.FC = observer(() => {
  let sum_otdel_phys = new Map();
  let sum_otdel_jur = new Map();
  return (
    <table id="printableTableReestr1">
      <thead>
        <tr>
          <th style={{ width: '50px' }}>№ п/п</th>
          <th style={{ width: '4%' }}>№ договора</th>
          <th style={{ width: '7%' }}>Заказчик</th>
          <th style={{ width: '7%' }}>Объект</th>
          <th style={{ width: '4%' }}>№ квитанции</th>
          <th>Сумма</th>
          <th>Контр.<br />сумма</th>
          <th>Сумма<br />старой системы</th>
          {store.org_structures.map((structure) => {
            return <th key={structure.id}>{structure.short_name ?? structure.name}</th>
          })}

        </tr>
      </thead>
      <tbody>
        {/* Юридические лица */}
        <tr className="section-title">
          <td colSpan={7}>Юридические лица</td>
        </tr>

        {store.youri_lica.map(app => {
          return <tr key={app.id} style={{ backgroundColor: store.rowClickedId === app.id && "#C7EBF9" }} onClick={() => store.clickRow(app.id)}>
            <td style={{ textAlign: 'center' }}>{app.index} {app.status_code === APPLICATION_STATUSES.done ? <><br /><CheckCircleOutlineIcon /></> : <></>}</td>
            <td>
              <Link
                target='_blank'
                style={{ textDecoration: "underline", marginLeft: 5, color: "blue" }}
                to={`/user/application/addedit?id=${app.id}`}>
                {app.number}
              </Link>
              <br />
              <br />
              {store.reestr?.status_code === "accepted" ? "" : <span style={{ textDecoration: "underline", marginLeft: 5, cursor: "pointer" }} onClick={() => store.deleteapplication_in_reestr(app.id)}>
                удалить
              </span>}
            </td>
            <td>{app.customer}</td>
            <td>{app.arch_object}</td>
            <td>{app.number_kvitancii}</td>
            {PaidPriceDifference(app.total_sum, app.sum_oplata)}
            <td>{app.total_sum}</td>
            <td>{app.old_sum}</td>
            {store.org_structures.map((structure) => {
              const sum = app.otdel_calcs.find(x => x.otdel_id === structure.id)
              if (sum_otdel_jur[structure.id] == null) sum_otdel_jur[structure.id] = 0;
              let total_sum = sum?.sum
              if(app.discount_percentage && app.discount_percentage !== 0){
                total_sum = total_sum - ((total_sum / 100) * app.discount_percentage)
              }
              if (sum)
                sum_otdel_jur[structure.id] += total_sum;
              return <td key={structure.id}>
                {sum && <>
                  {structure.short_name}<br />
                  <strong>{total_sum}</strong>
                </>}
              </td>
            })}
          </tr>
        })}


        <tr>
          <td colSpan={5} align='right'>Итого юр. лица</td>
          <td>{store.youri_summa?.toFixed(2)}</td>
          <td>{store.youri_lica.reduce((sum, item) => sum + item.total_sum, 0)?.toFixed(2)}</td>
          <td>{store.youri_lica.reduce((sum, item) => sum + item.old_sum, 0)?.toFixed(2)}</td>
          {store.org_structures.map((structure) => {
            let sum = sum_otdel_jur[structure.id];
            return <td>
              {sum && <>
                {structure.short_name}<br />
                <strong>{sum?.toFixed(2)}</strong>
              </>}
            </td>
          })}


          {/* <td colSpan={5} align='right'>Итого физ. лица</td>
          <td>{store.fizic_summa?.toFixed(2)}</td>
          <td>{store.fizic_lica.reduce((sum, item) => sum + item.sum, 0)?.toFixed(2)}</td>
          <td>{store.fizic_lica.reduce((sum, item) => sum + item.old_sum, 0)?.toFixed(2)}</td>
          {store.org_structures.map((structure) => {
            let sum = sum_otdel_phys[structure.id];
            return <td>
              {sum && <>
                {structure.short_name}<br />
                <strong>{sum?.toFixed(2)}</strong>
              </>}
            </td>
          })} */}
        </tr>


        {/* Физические лица */}
        <tr className="section-title">
          <td colSpan={7}>Физические лица</td>
        </tr>

        {store.fizic_lica.map(app => {
          return <tr key={app.id} style={{ backgroundColor: store.rowClickedId === app.id && "#C7EBF9" }} onClick={() => store.clickRow(app.id)}>
            <td style={{ textAlign: 'center' }}>{app.index} {app.status_code === APPLICATION_STATUSES.done ? <><br /><CheckCircleOutlineIcon /></> : <></>}</td>
            <td>
              <Link
                target='_blank'
                style={{ textDecoration: "underline", marginLeft: 5, color: "blue" }}
                to={`/user/application/addedit?id=${app.id}`}>
                {app.number}
              </Link>
              <br />
              <br />
              {store.reestr?.status_code === "accepted" ? "" : <span style={{ textDecoration: "underline", marginLeft: 5, cursor: "pointer" }} onClick={() => store.deleteapplication_in_reestr(app.id)}>
                удалить
              </span>}
            </td>
            <td>{app.customer}</td>
            <td>{app.arch_object}</td>
            <td>{app.number_kvitancii}</td>
            {PaidPriceDifference(app.total_sum, app.sum_oplata)}
            <td>{app.total_sum}</td>
            <td>{app.old_sum > 0 ? app.old_sum : null}</td>

            {store.org_structures.map((structure) => {
              const sum = app.otdel_calcs.find(x => x.otdel_id === structure.id)
              if (sum_otdel_phys[structure.id] == null) sum_otdel_phys[structure.id] = 0;
              let total_sum = sum?.sum
              if(app.discount_percentage && app.discount_percentage !== 0){
                total_sum = total_sum - ((total_sum / 100) * app.discount_percentage)
              }
              if (sum)
                sum_otdel_phys[structure.id] += total_sum;
              return <td key={structure.id}>
                {sum && <>
                  {structure.short_name}<br />
                  <strong>{total_sum}</strong>
                </>}
              </td>
            })}
          </tr>
        })}
        <tr>
          <td colSpan={5} align='right'>Итого физ. лица</td>
          <td>{store.fizic_summa?.toFixed(2)}</td>
          <td>{store.fizic_lica.reduce((sum, item) => sum + item.total_sum, 0)?.toFixed(2)}</td>
          <td>{store.fizic_lica.reduce((sum, item) => sum + item.old_sum, 0)?.toFixed(2)}</td>
          {store.org_structures.map((structure) => {
            let sum = sum_otdel_phys[structure.id];
            return <td>
              {sum && <>
                {structure.short_name}<br />
                <strong>{sum?.toFixed(2)}</strong>
              </>}
            </td>
          })}

        </tr>

        {/* Итог */}
        <tr>
          <td colSpan={5} align='right'>Всего</td>
          <td className="total">{store.all_summa?.toFixed(2)}</td>
          <td>{
            (store.fizic_lica.reduce((sum, item) => sum + item.total_sum, 0) + store.youri_lica.reduce((sum, item) => sum + item.total_sum, 0))?.toFixed(2)
          }</td>
          <td>{
            (store.fizic_lica.reduce((sum, item) => sum + item.old_sum, 0) + store.youri_lica.reduce((sum, item) => sum + item.old_sum, 0))?.toFixed(2)
          }</td>
          {store.org_structures.map((structure) => {
            let sum = (sum_otdel_phys[structure.id] ?? 0) + (sum_otdel_jur[structure.id] ?? 0);
            return <td>
              {sum && <>
                {structure.short_name}<br />
                <strong>{sum?.toFixed(2)}</strong>
              </>}
            </td>
          })}

          {/* <td colSpan={store.org_structures.length}></td> */}
        </tr>
      </tbody>
    </table>
  );
});

export default TableTemplate;
