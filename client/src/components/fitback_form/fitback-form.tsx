import "./fitback-form.scss";
import ButtonWithExplosion from "../Button/button"

export default function FitbackForm() {
  return (
    <section className="fitback-form-section">
      <h1 className="section-title scroll-animate">Как это работает?</h1>

      <div className="fitback-form-wrapper">
        {/* Левая часть — три блока */}
        <div className="form-left">
          <div className="feature-item scroll-animate">
            <div className="feature-box light-green">🛒</div>
            <div className="feature-text">
              <h3>Ваш сайт</h3>
              <p>Выберите дизайн вашего будущего сайта из предложенных выше вариантов.</p>
            </div>
          </div>

          <div className="feature-item scroll-animate">
            <div className="feature-box light-purple">
              <a href="#" target="_blank" rel="noopener noreferrer">📝</a>
            </div>
            <div className="feature-text">
              <h3>Ваши пожелания</h3>
              <p>Помогите нам ускорить работу. Опишите в мельчайших подробностях каким вы хотите видеть ваш сайт. Заполните Google форму.</p>
            </div>
          </div>

          <div className="feature-item scroll-animate">
            <div className="feature-box light-blue">
              <label htmlFor="file-upload" style={{ cursor: "pointer" }}>📎</label>
              <input
                type="file"
                id="file-upload"
                style={{ display: "none" }}
                multiple
              />
            </div>
            <div className="feature-text">
              <h3>Наполнение</h3>
              <p>Прикрепите архив с фото и видео фрагментами, которые будут отображаться на вашем сайте.</p>
            </div>
          </div>
        </div>

        {/* Правая часть — форма */}
        <div className="form-right scroll-animate">
          <div className="form-container">
            <div className="form-title">Последний шаг ✨</div>

            <div className="form-field">
              <input type="text" id="name" placeholder="Имя Фамилия" />
              <label htmlFor="name">ФИО</label>
            </div>

            <div className="form-field">
              <input type="text" id="contact" placeholder="Телефон или email" />
              <label htmlFor="contact">Контактные данные</label>
            </div>

            <div className="form-field">
              <textarea id="comment" placeholder="Здесь вы можете добавить " rows={6}></textarea>
              <label htmlFor="comment">Комментарий</label>
            </div>

            <div className="btn-wrapper">              
              <ButtonWithExplosion color="orange">Отправить</ButtonWithExplosion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
