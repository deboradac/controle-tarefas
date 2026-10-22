package jar;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private boolean concluida;
    private String prioridade;

    public Tarefa() {
    }

    public Tarefa(String titulo, boolean concluida, String prioridade) {
        this.titulo = titulo;
        this.concluida = concluida;
        this.prioridade = prioridade;
    }

    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public boolean isConcluida() {
        return concluida;
    }

    public String getPrioridade() {
        return prioridade;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setConcluida(boolean concluida) {
        this.concluida = concluida;
    }

    public void setPrioridade(String prioridade) {
        this.prioridade = prioridade;
    }
}